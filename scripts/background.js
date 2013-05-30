chrome.webRequest.onHeadersReceived.addListener(
  /* Удаляем имя файла из полученных хедеров,
     для работы аттрибута a[download] 
  */
  function(obj) {
    var newHeaders = obj.responseHeaders;
    for (var i=0; i<newHeaders.length; i++) {
      if (newHeaders[i].name == "Content-Disposition")
          newHeaders[i].value = "attachment";
    }
    return {responseHeaders: newHeaders};
  },
  // filters
  {
    urls: [
      'http://*.mixupload.org/*.mp3'
    ]
  },
  // extraInfoSpec
  ['blocking', 'responseHeaders']
);
/* анти трафик */
chrome.webRequest.onBeforeRequest.addListener(
  function(details) { return {cancel: true}; },
  {urls: ["http://*.mixupload.org/media/backgrounds/*"]},
  ["blocking"]);