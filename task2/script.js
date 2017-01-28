var get = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState != xhr.DONE) return;

        var status = xhr.status;
        var headers = xhr.getAllResponseHeaders();
        var text = xhr.responseText;

        callback(status, headers, text);
    }

    xhr.send();
}

var appendImage = function(url) {
    var imgEl = document.createElement('img');
    // <img />

    imgEl.src = url;
    // <img src="{url}" />

    imgEl.onerror = function() {
        imgEl.setAttribute("style", "display:none;");
    }
    document.getElementById('images').appendChild(imgEl);
    document.getElementById('loading').setAttribute("style", "display:none;");
}

// getImages({limit: 5})
// getImages({})
// getImages() -- by default should take 100 images

// getImages({limit: 5, category: "cats"})
// getImages({category: "cats"})
// getImages()

// "S"OLID, S -> Single Responsibility
var getImages = function (params = {}) {
  document.getElementById('loading').setAttribute("style", "display:block;");
    params.limit = document.getElementById("numb").value;
    params.category = document.getElementById("category").value;
        params.limit = params.limit || 100;
        params.category = params.category || 'cats';
        params.limit++;
        // var url = 'https://www.reddit.com/r/pics.json';
        var url = 'https://www.reddit.com/r/pics/search.json?q=';
        url += params.category;
        url += '/&limit=' + params.limit;
    
    get(url, function(status, headers, body) {
        var response = JSON.parse(body);

        _.each(response.data.children, function(child) {
            var url = child.data.url;

            appendImage(url);

            console.log('ITEM!', child.data.url);
        });

    });
}