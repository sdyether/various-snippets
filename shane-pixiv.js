// ==UserScript==
// @name                shane-pixiv
// @namespace           shane-pixiv
// @version             0.0.1
// @description         shane-pixiv
// @author              shane-pixiv
// @include             http://www.pixiv.net/member_illust.php?id=*
// @include             http://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @include             http://www.pixiv.net/member_tag_all.php?id=*
// ==/UserScript==

(function ()
{
	/* config stuff */
	var isCreatingMangaThumbnails = true;
	
	var isStrippingGarbage = true;
	
	var isHighlightingTags = true;
	var tagsToHighlight = ['秋山澪', 'けいおん!'];
	
	var isThemingWorksPage = false;
	var worksPageLastImageId = 59273206;
	
    /* funcs */
	
	function isMangaPage() {
		return document.URL.match(/http:\/\/www\.pixiv\.net\/member_illust\.php\?mode=medium&illust_id=/i)
		&& document.querySelectorAll("a._work.multiple").length !== 0;
	}

	function isWorksPage() {
		return document.URL.match(/http:\/\/www\.pixiv\.net\/member_illust\.php\?id=/i);
	}
	
	function isTagsPage() {
		return document.URL.match(/http:\/\/www\.pixiv\.net\/member_tag_all.php\?id=/i);
	}
	
	function getMangaPageCount() {
		var el = document.querySelectorAll(".work-info .meta li")[1];
		return parseInt(el.textContent.match(/\d+/i)[0]);
	}

	function getThumbnailUrl(resolution, mangaPageCount) {
		var baseUrl = document.querySelector('meta[property="og:image"]').getAttribute("content");
		return baseUrl.replace(/\/\d+x\d+\//, "/" + resolution + "/").replace(/_p0/, "_p" + mangaPageCount);
	}

	function getOriginalUrl(mangaPageCount, extension) {
		var url = document.querySelector('meta[property="og:image"]').getAttribute("content");
		return url.replace(/c\/\d+x\d+\/img-master/, "img-original")
		.replace(/_master1200/, "")
		.replace(/_p0/, "_p" + mangaPageCount)
		.replace(/\.jpg/, "." + extension);
	}
	
	function getPixivId() {
		return document.URL.match(/\d+/)[0];
	}
	
	/* We can't determine whether the original files are png or jpg without a call */
	function buildMangaThumbnails() {
	   var url = "http://www.pixiv.net/member_illust.php?mode=manga_big&illust_id=" + getPixivId() + "&page=0";

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.responseType = "text";
		xhr.timeout = 15000;
		xhr.onload = function (e) {
			if (xhr.status == 200) {
				var doc = new DOMParser().parseFromString(xhr.response, "text/html");
				var url = doc.getElementsByTagName("img")[0].src;
				var extension = url.substring(url.lastIndexOf('.') + 1);
				buildMangaThumbnailsContent(extension);
			}
		};
		xhr.send();
	}
	
	/* build a thumbnail preview/linker for manga pages */
	function buildMangaThumbnailsContent(extension) {

		var button = document.createElement("button");
		button.setAttribute("class", "add-bookmark _button");
		button.innerHTML = "Show Thumbnails (" + getMangaPageCount() + ") ";
		
		button.onclick = function() {
			if (contentDiv.style.display !== 'none') {
				contentDiv.style.display = 'none';
			}
			else {
				contentDiv.style.display = 'block';
			}
		};
		
		var contentDiv = document.createElement("div");
		contentDiv.style.display = 'none';
		contentDiv.style.padding = '5px';
		contentDiv.style.margin = '5px';
		contentDiv.style.backgroundColor = '#F0F8FF';

		for (var pageNumber = 0; pageNumber < getMangaPageCount(); pageNumber++) {
			el = document.createElement("a");
			el.href = getOriginalUrl(pageNumber, extension);
			el.innerHTML = "<img src='" + getThumbnailUrl("240x480", pageNumber) + "'/>";
			el.style.margin = '2px';
			contentDiv.appendChild(el);
        }
		
		var wrapDiv = document.createElement("div");
		wrapDiv.style.padding = '10px';
		wrapDiv.style.textAlign = 'center';
		wrapDiv.appendChild(button);
		wrapDiv.appendChild(contentDiv);
		
		el = document.querySelector("div.response-container");
		el.parentNode.insertBefore(wrapDiv, el);
	}
	
	/* *** */
	
	if (isMangaPage() && isCreatingMangaThumbnails) {
		buildMangaThumbnails();
	}
	
	//* highlight old images */
	if (isWorksPage() && isThemingWorksPage) {
		images = document.querySelectorAll("li.image-item");
		for (i = 0; i < images.length; ++i) {
			el = images[i].querySelector("a");
			if (el.href.match(/\d+/) <= worksPageLastImageId) {
				el.setAttribute("style", "border:3px solid #33FF33");
			}
		}
	}
	
	/* highlight tags configured in tagsToHighlight */
	if (isTagsPage() && isHighlightingTags) {
		tags = document.querySelectorAll("a.tag-name");
		for (i = 0; i < tags.length; ++i) {
			if (tagsToHighlight.includes(tags[i].textContent)) {
				tags[i].setAttribute("style", "color:#FF00FF; font-weight:bold");
			}
		}
	}
	
	/* do some page clean-up/quasi-adblocking (requests themselves aren't blocked) */
	if (isStrippingGarbage) {
		
		function removeAllByQuerySelector(selector) {
			while (document.querySelector(selector) !== null) {
				el = document.querySelector(selector);
				el.parentNode.removeChild(el);
			}
		}
		
		removeAllByQuerySelector("a.ads_anchor");
		removeAllByQuerySelector("ul.share-button");
		removeAllByQuerySelector("div.worksShare");
		removeAllByQuerySelector("ul._toolmenu");
	}

}());
