$(function() {
  function initialize()
  {
    /* Кнопка скачать рядом с плеером */
    $('div.tp-download').show();
    /* Вперед - назад */
    $('div#topplayer a').slice(0,2).show();
    $('a#p_download').mouseover( initDownloadPlayerButton );
    onPageChangedHandler();
    $('a#regLink').removeAttr('id');
    /* Удаляем рекламу */
    $('a#link_brand').remove();
    /* Показываем 40 треков */
    $('a[href="/tracksonpage/40"]').click();
    if($('div#ajax_main').children().length == 3)
      $('div#ajax_main').children().eq(1).remove();
  };

  /* Следим за измененями на странице */
  /* TODO: найти event для ajax */
  var onPageChangedHandler = function ()
  {
    var nodes = getAudioNodes();
    allDownloadLinksModify(nodes);
    makeTrackPublic();
    $('#jGrowl').remove();
    // правим отступ после удаления рекламы 
    $('div#generalwrapper').css('margin-top', '10px');
    setTimeout(onPageChangedHandler, 1000);
  };

  /* Получить список всех аудио-узлов */
  function getAudioNodes()
  {
    return $('div[id^="pl_track"]');
  };

  /* Делаем рабочую ссылку на скачивание  */
  function allDownloadLinksModify(nodes)
  {
    for (var i = 0; i < nodes.length; i++)
    {
      getTrackId(nodes[i]);
      
      /* Кол-во ссылок (скачать, канал, поделиться) */
      var s = $(nodes[i]).find('div.menudl s');
      if (s.size() == 2) {
        $(s[0]).clone().prependTo(s.parent());
      }
      
      /* Работаем с тегом */
      var link = $(nodes[i]).find('div.menudl a:first');
      if ($(link).attr('onclick'))
        $(link).removeAttr('onclick');

      if ($(link).attr('title') != 'Download!')
        linkModify(link, nodes[i]);
    }
  };

  /* Получить название трека */
  function getTrackTitle(node)
  {
    if (typeof node != 'undefined') {
      //return $.trim($(node).find('a.track-title').text().split(' ').join('_')) + '.mp3';
      return $.trim($(node).find('a.track-title').text()) + '.mp3';
    }
    else {
      //return $.trim($("a#p_tracktitle").text().split(' ').join('_')) + '.mp3';
      return $.trim($("a#p_tracktitle").text()) + '.mp3';
    }
  };
  
  /* Получить ссылку на трек */
  function getDownloadLink(node)
  {
    var id = getTrackId(node);
    var url = 'http://p0.mixupload.org/player/play/' + id + '/0/track.mp3';
    return url;
  };
  
  /* Получить номер (id) трека */
  function getTrackId(node)
  {
    var pattern = /[0-9]+$/;
    if ( typeof node != 'undefined' ) {
      /* треки есть на странице */
      return parseInt( pattern.exec(node.id)[0] );
    } 
    else {
      /* на странице уже нет песен */
      return parseInt( pattern.exec($('a#p_download').attr('href')) );
    }
  };
  
  /* Изменить ссылку для скачивания. 
    a - html object link to modify
    node - 
  */
  function linkModify(a, node){
    $(a).attr('download', getTrackTitle(node)  );
    $(a).attr('href'    , getDownloadLink(node));
    $(a).attr('title'   , 'Download!'); // Do not modify
    $(a).css ('color'   , '#b69c7e');
    if( $(a).find('img').size() == 0 )
      $(a).text(chrome.i18n.getMessage("download"));
    
    $(a).removeAttr('class');
    $(a).removeAttr('target');
  }
  
  /* Кнопка "СКАЧАТЬ" рядом с плеером */
  function initDownloadPlayerButton()
  {
    var pattern = /[0-9]+$/;
    var trackId = pattern.exec($(this).attr('href'));
    if (trackId != null) {
      var node = document.getElementsByClassName('track-now')[0];
      linkModify(this, node);
    }
  };

    /* The track is in the closed section of the portal. */
  function makeTrackPublic()
  {
    $('a.notAllowed.nojs.track-btn').each(function( index ) {
      var el = $(this);
      var id = el.attr('href').substring(1);
      // $('#pl_track' + id).remove();
      el.attr('href', 'javascript: p.playTrack(PlayList,' + id + ');');
      el.removeClass('nojs notAllowed');
    });
  }
  initialize();
});