function httpReq(type, url, callback, params, headers, data, contentType, username, password, allowCache) {
	var options = {
		type: type,
		url: url,
		processData: false,
		data: data,
		cache: allowCache ? false : true,
		beforeSend: function (xhr) {
			for (var i in headers) {
				xhr.setRequestHeader(i, headers[i]);
			}
			xhr.setRequestHeader("X-Requested-With", "jsAutomator");
		}
	};
	if (callback) {
		options.complete = function (xhr, textStatus) {
			if (jQuery.httpSuccess(xhr)) {
				callback(true, params, xhr.responseText, url, xhr);
			} else {
				callback(false, params, null, url, xhr);
			}
		};
	}
	if (contentType) {
		options.contentType = contentType;
	}
	if (username) {
		options.username = username;
	}
	if (password) {
		options.password = password;
	}
	if (window.Components && window.netscape && window.netscape.security && document.location.protocol.indexOf("http") == -1) {
		window.netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	}
 	jQuery.ajax(options);
}

function removeNode(e) {
	jQuery(e).remove();
}