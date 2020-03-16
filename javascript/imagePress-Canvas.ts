const file: Blob

const reader = new FileReader()
reader.readAsDataURL(file)
reader.onloadend = (result: any) => {
  file.base64Url = result.srcElement.result
  // 压缩图片
  this.imgCompress(file, { quality: 0.8 }).then(blob => {})
}

function imgCompress(file: any, obj: any) {
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
