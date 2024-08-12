// クリップボードへコピー（コピーの処理）
export const copyToClipboard = (value: string) => {
  if (navigator.clipboard) {
    // navigator.clipboardが使えるか判定する
    return navigator.clipboard.writeText(value).then(function () {
      // クリップボードへ書きむ
    })
  } else {
    document.execCommand('copy') // クリップボードにコピーする
  }
}
