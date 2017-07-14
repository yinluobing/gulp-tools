/*chat*/
function chat() {
	if ('undefined' != typeof openZoosUrl ) {
		openZoosUrl()
		return true;
	} else if ('undefined' != typeof KS) {
		KS.openChatWin();
		return true;
	} else {
		console.log('商务通没有加载!\n或者快商通没有加载!');
		return false;
	}
}