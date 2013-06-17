(function () {
    function merge(a, b) {
        var result = a;
        for (var property in b) {
            if (b.hasOwnProperty(property)) {
                result[property] = b[property];
            }
        }
        return result;
    }

    // Get css url
    require.css = function (name) {
        var context = require.s.contexts["_"];
        var specialTheme = name + "/theme";
        if (context.config.paths.hasOwnProperty(specialTheme)) {
            name = specialTheme;
        }
        return context.nameToUrl(name, ".css", null);
    };

    // Module Map
    var modules =
    {
        "jquery": "/scripts/lib/jquery.min",
        "audiojs": "/scripts/lib/audiojs/audio.min",
        "jquery-snippet": "/scripts/lib/jquery-plugins/jquery.snippet.min",
        "jquery-snippet/theme": "/scripts/lib/jquery-plugins/jquery.snippet.min",
        "twitter-widgets": "http://platform.twitter.com/widgets",
        "twitterjs": "http://twitterjs.googlecode.com/svn/trunk/src/twitter.min",
        "sharethis": "http://w.sharethis.com/button/buttons",
    };

    // Configuration
    require({
        baseUrl: "/scripts",
        paths: modules,
        waitSeconds: 15,
        deps: ["jquery"]
    });
})();

// Sharethis button

function Initialize(config) {
  window.switchTo5x = true;
  
  // Sharethis button
  require(["sharethis"], function() {
    stLight.options({publisher: "bf8855c0-9a27-4acf-b8f4-b366c2085e79", onhover: false});
  });
}

function Startup(config) {
  (function() {
    jQuery.extend({
        loadCss: function (url) {
            /// <summery>Load CSS file.</summery>
            /// <param name="url" type="String">
            /// CSS file url.
            /// </param>
            var link = $("<link />").attr({ type: 'text/css', rel: 'stylesheet', href: url });

            $.ajax({ url: url, async: true });
            // Chrome insert new link must on new function call.
            $.proxy(function () {
                this.insertBefore($("link").first());
            }, link)();
            if ($.browser.msie) {
                // MSIE <link> tag insertion sequence does not work, dynamically added CSS always overwrite existing style.
                // So here update all styles
                $("link").attr("type", "").attr("type", "text/css");
            }
        }
    });
  })();


  // jquery-snippet
  (function() {
    var codeBlocks = $("pre");
    if(codeBlocks.size() > 0) {
      $.loadCss(require.css("jquery-snippet"));
      require(["jquery-snippet"], function() {
        codeBlocks.each(function() {
          var lang = $(this).attr("lang");
          if(lang)
            $(this).snippet(lang, {style: "darkness"});
          else
            $(this).attr("lang", "none");
        });
      });
    }
  })();


  // disqus comments
  (function() {
    disqus_shortname = config.username;
    
    var LoadScript = function(url) {
      require([url]);
    };

    // Post comments
    var post = $("article");
    if(post.size() == 1) {
      var identifier = post.data("identifier");
      $("div[data-identifier=" + identifier + "]").append($("<div>", {id: "disqus_thread"}));
      disqus_identifier = identifier;
      
      LoadScript('http://' + config.username + '.disqus.com/embed.js');
    }

    // Comment count
    LoadScript('http://' + config.username + '.disqus.com/count.js');
  })();

  // audio.js
  (function() {
    if($("audio").size() > 0) {
      require(["audiojs"], function() {
        audiojs.events.ready(function() {
          var as = audiojs.createAll();
        });
      });
    }
  })();

  (function() {
    if(config.microlog.type == "twitter") {
      // Twitter
      require(["twitter-widgets", "twitterjs"], function() {
        getTwitters('tweets', { 
          id: config.microlog.uid, 
          count: 5, 
          enableLinks: true, 
          ignoreReplies: true, 
          clearContents: true,
          template: '%text% - %time%'
        });
      });
    }
  })();
}