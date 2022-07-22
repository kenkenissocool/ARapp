/********************************************************************************

	SYNCER 〜 知識、感動をみんなと同期(Sync)するブログ

	* 配布場所
	https://syncer.jp/jquery-modal-window

	* 最終更新日時
	2015/08/17 15:55

	* 作者
	あらゆ

	** 連絡先
	Twitter: https://twitter.com/arayutw
	Facebook: https://www.facebook.com/arayutw
	Google+: https://plus.google.com/114918692417332410369/
	E-mail: info@syncer.jp

	※ バグ、不具合の報告、提案、ご要望など、お待ちしております。
	※ 申し訳ありませんが、ご利用者様、個々の環境における問題はサポートしていません。

********************************************************************************/


$(function(){

//$("#modal-open").click( function(){

	$( this ).blur() ;	//ボタンからフォーカスを外す
	if( $( "#modal-overlay" )[0] ) return false ;		//新しくモーダルウィンドウを起動しない (防止策1)
	//if($("#modal-overlay")[0]) $("#modal-overlay").remove() ;		//現在のモーダルウィンドウを削除して新しく起動する (防止策2)

	//オーバーレイを出現させる
	$( "body" ).append( '<div id="modal-overlay"></div>' ) ;
	$( "#modal-overlay" ).fadeIn( "slow" ) ;

	//コンテンツをセンタリングする
	centeringModalSyncer() ;

	//コンテンツをフェードインする
	$( "#modal-content" ).fadeIn( "slow" ) ;

	//[#modal-overlay]、または[#resp]をクリックしたら…
	$( "#modal-overlay,#resp" ).unbind().click( function(){
		//[#modal-content]と[#modal-overlay]をフェードアウトした後に…
		$( "#modal-content,#modal-overlay" ).fadeOut( "slow" , function(){
			$('#modal-overlay').remove() ;
		});
	});
//});

$( window ).resize( centeringModalSyncer ) ;

	function centeringModalSyncer() {

		var w = $( window ).width() ;
		var h = $( window ).height() ;

		var cw = $( "#modal-content" ).outerWidth();
		var ch = $( "#modal-content" ).outerHeight();

		$( "#modal-content" ).css( {"left": ((w - cw)/2) + "px","top": ((h - ch)/2) + "px"} ) ;
	}
} ) ;


window.onload = function(){
	crear_select();
  }
  
  function isMobileDevice() {
	  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  };
  
   
  var li = new Array();
  function crear_select(){
  var div_cont_select = document.querySelectorAll("[data-mate-select='active']");
  var select_ = '';
  for (var e = 0; e < div_cont_select.length; e++) {
  div_cont_select[e].setAttribute('data-indx-select',e);
  div_cont_select[e].setAttribute('data-selec-open','false');
  var ul_cont = document.querySelectorAll("[data-indx-select='"+e+"'] > .cont_list_select_mate > ul");
   select_ = document.querySelectorAll("[data-indx-select='"+e+"'] >select")[0];
   if (isMobileDevice()) { 
  select_.addEventListener('change', function () {
   _select_option(select_.selectedIndex,e);
  });
   }
  var select_optiones = select_.options;
  document.querySelectorAll("[data-indx-select='"+e+"']  > .selecionado_opcion ")[0].setAttribute('data-n-select',e);
  document.querySelectorAll("[data-indx-select='"+e+"']  > .icon_select_mate ")[0].setAttribute('data-n-select',e);
  for (var i = 0; i < select_optiones.length; i++) {
  li[i] = document.createElement('li');
  if (select_optiones[i].selected == true || select_.value == select_optiones[i].innerHTML ) {
  li[i].className = 'active';
  document.querySelector("[data-indx-select='"+e+"']  > .selecionado_opcion ").innerHTML = select_optiones[i].innerHTML;
  };
  li[i].setAttribute('data-index',i);
  li[i].setAttribute('data-selec-index',e);
  // funcion click al selecionar 
  li[i].addEventListener( 'click', function(){  _select_option(this.getAttribute('data-index'),this.getAttribute('data-selec-index')); });
  
  li[i].innerHTML = select_optiones[i].innerHTML;
  ul_cont[0].appendChild(li[i]);
  
	  }; // Fin For select_optiones
	}; // fin for divs_cont_select
  } // Fin Function 
  
  
  
  var cont_slc = 0;
  function open_select(idx){
  var idx1 =  idx.getAttribute('data-n-select');
	var ul_cont_li = document.querySelectorAll("[data-indx-select='"+idx1+"'] .cont_select_int > li");
  var hg = 0;
  var slect_open = document.querySelectorAll("[data-indx-select='"+idx1+"']")[0].getAttribute('data-selec-open');
  var slect_element_open = document.querySelectorAll("[data-indx-select='"+idx1+"'] select")[0];
   if (isMobileDevice()) { 
	if (window.document.createEvent) { // All
	var evt = window.document.createEvent("MouseEvents");
	evt.initMouseEvent("mousedown", false, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	slect_element_open.dispatchEvent(evt);
  } else if (slect_element_open.fireEvent) { // IE
	slect_element_open.fireEvent("onmousedown");
  }else {
	slect_element_open.click();
  }
  }else {
  
	
	for (var i = 0; i < ul_cont_li.length; i++) {
  hg += ul_cont_li[i].offsetHeight;
  }; 
   if (slect_open == 'false') {  
   document.querySelectorAll("[data-indx-select='"+idx1+"']")[0].setAttribute('data-selec-open','true');
   document.querySelectorAll("[data-indx-select='"+idx1+"'] > .cont_list_select_mate > ul")[0].style.height = hg+"px";
   document.querySelectorAll("[data-indx-select='"+idx1+"'] > .icon_select_mate")[0].style.transform = 'rotate(180deg)';
  }else{
   document.querySelectorAll("[data-indx-select='"+idx1+"']")[0].setAttribute('data-selec-open','false');
   document.querySelectorAll("[data-indx-select='"+idx1+"'] > .icon_select_mate")[0].style.transform = 'rotate(0deg)';
   document.querySelectorAll("[data-indx-select='"+idx1+"'] > .cont_list_select_mate > ul")[0].style.height = "0px";
   }
  }
  
  } // fin function open_select
  
  function salir_select(indx){
  var select_ = document.querySelectorAll("[data-indx-select='"+indx+"'] > select")[0];
   document.querySelectorAll("[data-indx-select='"+indx+"'] > .cont_list_select_mate > ul")[0].style.height = "0px";
  document.querySelector("[data-indx-select='"+indx+"'] > .icon_select_mate").style.transform = 'rotate(0deg)';
   document.querySelectorAll("[data-indx-select='"+indx+"']")[0].setAttribute('data-selec-open','false');
  }
  
  
  function _select_option(indx,selc){
   if (isMobileDevice()) { 
  selc = selc -1;
  }
	  var select_ = document.querySelectorAll("[data-indx-select='"+selc+"'] > select")[0];
  
	var li_s = document.querySelectorAll("[data-indx-select='"+selc+"'] .cont_select_int > li");
	var p_act = document.querySelectorAll("[data-indx-select='"+selc+"'] > .selecionado_opcion")[0].innerHTML = li_s[indx].innerHTML;
  var select_optiones = document.querySelectorAll("[data-indx-select='"+selc+"'] > select > option");
  for (var i = 0; i < li_s.length; i++) {
  if (li_s[i].className == 'active') {
  li_s[i].className = '';
  };
  li_s[indx].className = 'active';
  
  };
  select_optiones[indx].selected = true;
	select_.selectedIndex = indx;
	select_.onchange();
	salir_select(selc); 
  }