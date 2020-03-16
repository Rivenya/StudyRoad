import { Component, Vue, Prop } from 'vue-property-decorator'
import { Upload, Icon, Spin, Button } from 'ant-design-vue'
import OSS from 'ali-oss'

const BaseUrl = 'http://xinchi-public.oss-cn-beijing.aliyuncs.com/'
/**暂时只支持图片 */
@Component({
  name: 'ossUpload',
  components: {
    'a-upload': Upload,
    'a-icon': Icon,
    'a-spin': Spin,
    'a-btn': Button
  }
})
class OssUpload extends Vue {
  loading = false

  /**oss图片的key */
  key: string = ''

  /**文件的地址显示*/
  fileUrl = ''

  /**文件名 */
  fileName = '上传的文件'

  /**oss的实例 */
  clent: any = null

  /**加载中 */
  spinning: boolean = false

  /**oss的类型公共库还是私人库 */
  @Prop({ default: 'image' }) fileType?: 'image' | 'video' | 'other'

  /**oss的类型公共库还是私人库 */
  @Prop({ default: 'private' }) uploadType?: 'private' | 'public'

  /**预览的Img */
  @Prop() previewImage?: string

  /**上传前的校验 */
  @Prop() validator?: (file: any) => Promise<string | undefined>

  /**文件后缀限制-默认限制图片 */
  @Prop({
    type: Array,
    default() {
      return ['image/jpeg', 'image/png', 'image/jpg']
    }
  })
  limitFileExtension?: string[]

  /**限制大小，默认10M */
  @Prop({ default: 10 }) limitNum!: Number

  /**上传成功的回调 ---key:保存到Oss的Key */
  @Prop() handleChange!: (key: string, imgUrl: string) => void

  uploadPath(file: any) {
    // 上传文件的路径，使用日期命名文件目录
    return `${new Date().getFullYear()}/${new Date().getMonth() +
      1}/${new Date().getDate()}/${file.name.split('.')[0]}-${file.uid}.${
      file.type.split('/')[1]
    }`
  }

  getBase64(img: any, callback: any) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  clean() {
    this.key = ''
    this.fileUrl = ''
  }

  /**压缩图片 */
  imgCompress(file: any, obj: any) {
    return new Promise(resolve => {
      const img = new Image()
      img.src = file.base64Url
      img.onload = () => {
        const that: any = img
        const w: number = that.width
        const h: number = that.height
        const quality = obj.quality || 0.8
        //压缩
        const canvas = document.createElement('canvas')
        const ctx: any = canvas.getContext('2d')
        canvas.setAttribute('width', w.toString())
        canvas.setAttribute('height', h.toString())
        ctx.drawImage(that, 0, 0, w, h)
        const base64 = canvas.toDataURL('image/jpeg', quality)
        //转Blob,生成file（避免ios不兼容）
        const arr: any = base64.split(',')
        const blobMine = arr[0].match(/:(.*?);/)[1]
        //解码base64
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          //编码
          u8arr[n] = bstr.charCodeAt(n)
        }
        //生成file
        const blob: any = new Blob([u8arr], { type: blobMine })
        blob.lastModifiedDate = new Date()
        blob.name = file.name
        blob.uid = file.uid
        blob.base64Url = file.base64Url
        resolve(blob)
      }
    })
  }

  /**上传到oss */
  UploadToOss(file: any) {
    this.clean()
    const url = this.uploadPath(file)
    this.loading = true
    //上传文件
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = (result: any) => {
      file.base64Url = result.srcElement.result
      // 压缩图片
      this.imgCompress(file, { quality: 0.8 }).then(blob => {
        this.clent.multipartUpload(url, blob).then((res: any) => {
          this.loading = false
          //获取图片地址
          this.key = res.name
          this.fileUrl = this.clent.signatureUrl(res.name, { expires: 600 })
          if (this.$props.uploadType === 'private') {
            this.handleChange(res.name, this.fileUrl)
          } else {
            this.handleChange(res.name, `${BaseUrl}${res.name}`)
          }
        })
      })
    }
  }

  /**上传前的校验 */
  beforeUpload(file: any) {
    const isExsit =
      this.$props.limitFileExtension.length === 0
        ? false
        : !this.$props.limitFileExtension.some(
            (item: string) => file.type === item
          )
    const isLimit = file.size / 1024 / 1024 < this.limitNum
    if (isExsit) {
      this.$message.error('上传文件格式错误')
    } else if (!isLimit) {
      this.$message.error(`上传文件必须小于${this.limitNum}M`)
    } else if (this.$props.validator) {
      this.$props.validator(file).then((res: string) => {
        if (res) {
          this.$message.error(res)
        } else {
          this.UploadToOss(file)
        }
      })
    } else {
      this.UploadToOss(file)
    }
    //return false是为了关闭antd的默认上传
    return false
  }

  mounted() {
    this.spinning = true
    new Promise(resolve => {
      window.api.getOssToken({}).then(res => {
        const bucket =
          this.$props.uploadType === 'private' ? 'xinchi' : 'xinchi-public'
        const { accessKeyId, accessKeySecret, securityToken } = res.data.data
        this.clent = new OSS({
          accessKeyId: accessKeyId,
          accessKeySecret: accessKeySecret,
          stsToken: securityToken,
          region: 'oss-cn-beijing',
          bucket: bucket
        })
        resolve()
      })
    }).then(result => {
      //如果有图片先渲染图片
      if (this.$props.previewImage) {
        this.key = this.$props.previewImage
        this.fileUrl = this.clent.signatureUrl(this.key, { expires: 600 })
        this.spinning = false
      } else {
        this.spinning = false
      }
    })
  }

  render() {
    const uploadButton = (
      <div>
        <a-icon type={this.loading ? 'loading' : 'plus'} />
        <div className="antd-upload-text">点击上传</div>
      </div>
    )

    const img = this.$slots.default ? (
      this.$slots.default
    ) : (
      <img src={this.fileUrl} width="200px" height="200px" />
    )

    const reUpload = (
      <div>
        <a-icon type={this.loading ? 'loading' : 'plus'} />
        <div className="antd-upload-text">重新上传</div>
      </div>
    )

    const fileList = (
      <div style={{ height: '20px', lineHeight: '20px', cursor: 'pointer' }}>
        <div style={{ display: 'inline-block', width: '50%' }}>
          <a-icon type="paper-clip" />
          <span title={this.fileName}>{this.fileName}</span>
        </div>
        <div style={{ display: 'inline-block' }}>
          <a-icon type="close" style={{ color: 'red' }} on-click={this.clean} />
        </div>
      </div>
    )

    return (
      <div>
        <a-upload
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          beforeUpload={this.beforeUpload}
        >
          <a-spin spinning={this.spinning}>
            {this.$props.fileType === 'image' && (
              <div>{this.fileUrl ? img : uploadButton}</div>
            )}
            {this.$props.fileType !== 'image' && (
              <div>{!this.fileUrl ? reUpload : uploadButton}</div>
            )}
          </a-spin>
        </a-upload>
        {this.fileUrl && fileList}
      </div>
    )
  }
}

export default OssUpload
