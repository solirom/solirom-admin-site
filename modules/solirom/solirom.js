window.solirom = {};

solirom.events = {};
solirom.actions = {};
solirom.data = {};
solirom.controls = {};

solirom.actions.b64EncodeUnicode = str => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
};

solirom.actions.b64DecodeUnicode = str => {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};

solirom.actions.generate_uuid = () => {
  const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
  
  return "uuid-" + uuid
};

solirom.actions.scrollIntoView = (elementId, mainElementId) => {
    document.getElementById(elementId).scrollIntoView();
    document.getElementById(mainElementId).scrollIntoView();
};

solirom.actions.html = function(strings, ...args) {
  const interleaved = args.reduce(
    (acc, arg, index) => {
      return [...acc, arg, strings[index + 1]];
    },
    [strings[0]]
  );

  return props =>
    interleaved
      .map(part => (typeof part === "function" ? part(props) : part))
      .join("");
};

solirom.actions.responseStatus = (response) => {
	if (response.status >= 200 && response.status < 300) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
};

solirom.gitea = {
	"accessToken": "",
	"apiBaseUrl": "",
	"sha": "",
	"getFile": (url) => {
		fetch(url, {
		    headers: {
		    "Content-Type": "application/json",
		    "Authorization": "token " + solirom.gitea.accessToken
		    }
		})
		.then((response) => response.json())
		.then((data) => {
		    solirom.gitea.sha = data.sha;
		    var content = data.content;
		    content = solirom.actions.b64DecodeUnicode(content);
		    teian.editor.setAttribute("status", "edit");
		    teian.editor.setAttribute("src", "data:application/xml;" + content);
		})
		.catch((error) => {
		    console.error('Error:', error);
		});		
	},
	"postFile": (url, data) => {
		
	}
};

export default solirom;
