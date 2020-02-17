import React, { useState } from 'react'
import { WebView } from 'react-native-webview'
import { Platform, Dimensions } from 'react-native'

interface RichRextRenderProps {
  htmlRender: string
  width?: number
}
const RichRextRender: React.FC<RichRextRenderProps> = props => {
  const [height, setHeight] = useState(0)

  const html = `<!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <style>
                    * {
                    margin: 0;
                    padding: 0;
                    }
                    html {
                      overflow: hidden;
                    }
                    body {
                    overflow-x: hidden;
                    }
                  </style>
                  <body>
                    <div style="margin-bottom:50px">
                      ${props.htmlRender}
                    </div>
                  </body>
                </html>`

  const onWebViewMessage = (event: any) => {
    setHeight(Number(event.nativeEvent.data))
  }

  const scalesPageToFit = Platform.OS === 'android'

  return (
    <WebView
      originWhitelist={['*']}
      source={{
        html: html
      }}
      style={{
        height: Math.max(height, Dimensions.get('window').height),
        width: props.width ? props.width : Dimensions.get('window').width
      }}
      injectedJavaScript="window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)"
      onMessage={onWebViewMessage}
      scrollEnabled={false}
      bounces={false}
      scalesPageToFit={scalesPageToFit}
      mixedContentMode={'always'}
      allowsFullscreenVideo={true}
    ></WebView>
  )
}
export default RichRextRender
