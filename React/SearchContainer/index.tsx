import React, { useState, useEffect } from 'react';
import Style from './index.less';

import { Row, Col, Input, Button, Pagination } from 'antd';

export type SearchContainerProps = {
  /** 顶部是否需要*/
  headerVisable?: boolean;
  /**
   * @param {number} key 唯一索引
   * @param {string} type 搜索框类型
   * @param {string} placeholoder
   */
  filterProps?: filterProps;
  /**
   * @param {object} filterParams 过滤参数
   * @param {number} pageSize 每页条数
   * @param {number} pageCurrent 当前页数
   */
  fetchData: ({
    filterParams,
    pageSize,
    pageCurrent,
  }: {
    filterParams: any;
    pageSize: number;
    pageCurrent: number;
  }) => Promise<{ data: any; total: number }>;
  /** 添加按钮*/
  addBtn?: boolean;
  /** 添加回调*/
  addFn?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /** 导出按钮*/
  expo?: boolean;
  /** 导出回调*/
  expoFn?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /** 导入按钮*/
  impo?: boolean;
  /** 导入回调*/
  impoFn?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /** 右侧菜单栏*/
  rightMenu?: {
    key: number;
    title: string;
    onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    style?: React.CSSProperties;
    shape?: 'circle' | 'round' | 'circle-outline';
    icon?: string;
    type?: 'link' | 'default' | 'ghost' | 'primary' | 'dashed' | 'danger';
  }[];
  /**
   * @param {function} onChange 页面改变回调
   * @param {number} total 返回数据总数
   * @param {number} pageSize 默认每页条数
   * @param {string} simple 简单模式分页
   * @param {boolean} showQuickJumper 快速跳转页面功能
   * @param {boolean} showSizeChanger 每页设置条数功能
   */
  pageProps?: {
    pageSize: number;
    simple?: boolean;
    showQuickJumper?: boolean;
    showSizeChanger?: boolean;
    pageSizeOptions?: string[];
  };
  /**
   *
   *
   */
  itemRender?: {
    renderFn: (data: any[]) => JSX.Element;
  };
};

type filterProps = {
  key: string;
  type: 'input' | 'select';
  placeholder?: string;
}[];

/**
 * @param {boolean} headerJsx 顶部搜索是否需要
 * @param {filterPropst} filterProps 搜索框参数
 * @param {object} pageProps 分页参数
 * @param {boolean} addBtn 添加按钮
 * @param {function} addFn 添加按钮函数
 * @param {boolean} expo 导出按钮
 * @param {function} expoFn 导出按钮函数
 * @param {boolean} impo 导入按钮
 * @param {function} impoFn 导入按钮函数
 * @param {object} rightMenu 右侧自定义按钮
 * @param {object} itemRender 自定义渲染，和props.chidren冲突
 * @returns
 */
const SearchContainer: React.FC<SearchContainerProps> = ({
  headerVisable = true,
  addBtn = false,
  expo = false,
  impo = false,
  filterProps = [],
  rightMenu = [],
  ...props
}) => {
  /**响应式动态计算宽度的值 */
  let searchBtnWidth = Number(addBtn) + Number(expo) + Number(impo) + rightMenu.length;

  /**当前分页数据 */
  const [itemData, setItemData] = useState();

  /**当前分页页数 */
  const [pageCurrent, setPageCurrent] = useState(1);

  /**每页显示条数 */
  const [pageSize, setPageSize] = useState(props.pageProps ? props.pageProps.pageSize : 10);

  /**分页总数*/
  const [total, setTotal] = useState();

  /**过滤框的值 */
  const [formData, setFormData] = useState<any>({});

  /**发送请求获取数据 */
  const getData = ({
    filterParams = formData,
    pagesize = pageSize,
    pagecurrent = pageCurrent,
  }: {
    filterParams?: any;
    pagesize?: number;
    pagecurrent?: number;
  }) => {
    props
      .fetchData({ filterParams: filterParams, pageSize: pagesize, pageCurrent: pagecurrent })
      .then(({ data, total }) => {
        setItemData(data);
        setTotal(total);
      });
  };

  /**搜索按钮点击事件 */
  const handleClick = (event: React.SyntheticEvent<any, Event>): void => {
    getData({});
  };

  /**重置按钮点击事件 */
  const handleReset = (event: React.SyntheticEvent<any, Event>): void => {
    setFormData({});
    getData({ filterParams: {} });
  };

  useEffect(() => {
    getData({});
  }, [pageSize, pageCurrent]);

  return (
    <div className={Style.filterCardProps}>
      {/* 顶部 */}
      {headerVisable && (
        <Row className={Style.header}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={searchBtnWidth > 2 ? 24 : filterProps.length * 4}
            xl={filterProps.length * 4}
            className={Style.searchContainer}
          >
            <Row>
              {filterProps.map(item => {
                if (item.type === 'input') {
                  return (
                    <Col
                      xs={12}
                      sm={24 / filterProps.length}
                      md={24 / filterProps.length}
                      lg={24 / filterProps.length}
                      xl={24 / filterProps.length}
                      key={item.key}
                      className={Style.searchInput}
                    >
                      <Input
                        key={item.key}
                        value={formData[item.key]}
                        onChange={event =>
                          setFormData({ ...formData, [item.key]: event.target.value })
                        }
                        placeholder={item.placeholder}
                      />
                    </Col>
                  );
                } else {
                  return false;
                }
              })}
            </Row>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={searchBtnWidth > 2 ? 24 : 24 - filterProps.length * 4}
            xl={24 - filterProps.length * 4}
            className={Style.btnContainer}
          >
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xl={24 - searchBtnWidth * 4}>
                {filterProps.length > 0 && (
                  <>
                    <Button
                      type="primary"
                      icon="search"
                      onClick={handleClick}
                      className={Style.searchBtn}
                    >
                      搜索
                    </Button>
                    <Button type="primary" icon="reload" onClick={handleReset}>
                      重置
                    </Button>
                  </>
                )}
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={searchBtnWidth * 4}
                style={{ textAlign: 'right' }}
              >
                {addBtn && (
                  <Button className={Style.addInput} icon="plus" onClick={props.addFn}>
                    添加
                  </Button>
                )}
                {impo && (
                  <Button
                    className={Style.addInput}
                    shape="circle"
                    onClick={props.impoFn}
                    icon="upload"
                    title="导入"
                  />
                )}
                {expo && (
                  <Button shape="circle" icon="export" onClick={props.expoFn} title="导出" />
                )}
                {rightMenu.length > 0 &&
                  rightMenu.map((item, index) =>
                    !item.shape ? (
                      <Button {...rightMenu[index]}>{item.title}</Button>
                    ) : (
                      <Button {...rightMenu[index]} />
                    ),
                  )}
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {/* 中间容器 */}
      <div className={Style.container}>
        {props.itemRender ? props.itemRender.renderFn(itemData) : props.children}
      </div>
      {/* 底部分页 */}
      {props.pageProps && (
        <div className={Style.footer}>
          <Pagination
            {...props.pageProps}
            pageSize={pageSize}
            current={pageCurrent}
            total={total}
            onShowSizeChange={(current, size) => {
              setPageCurrent(current);
              setPageSize(size);
            }}
            onChange={(page, pageSize) => {
              setPageCurrent(page);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchContainer;
