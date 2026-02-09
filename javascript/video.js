// Vanilla-JS-Lazy-Video-Load - Written in pure Vanilla JS, no jQuery needed. GDPR compliant, PageSpeed optimized.

function startVideo() {
    var videoContainer = document.querySelectorAll(".video-container");
    var section = document.querySelectorAll("section");
    section.forEach(function (element) {
        element.classList.remove("activate-cookie");
    });
    videoContainer.forEach(function (container) {
        if (container.classList.contains("video-youtube")) {
            document.querySelectorAll(".video-youtube").forEach(function (element) {
                var dataEmbedFull = element.getAttribute("data-embed-full");
                var dataPlayIcon = element.getAttribute("data-play-icon");
                var substringYouTube = "https://www.youtube.com/embed/";
                if (dataEmbedFull.indexOf(substringYouTube) === -1) {
                    dataEmbedFull = substringYouTube + dataEmbedFull;
                }
                function getId(url) {
                    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
                    var match = url.match(regExp);
                    return match && match[2].length === 11 ? match[2] : "error";
                }
                var myId = getId(dataEmbedFull);
                element.setAttribute("data-embed", myId);
                document.querySelectorAll(".cookie-accept").forEach(function (element) {
                    element.querySelector(".cookie-accept-btn").setAttribute("tabindex", "0");
                });
                var thumb = element;
                var dataEmbedSet = thumb.dataset.embed;
                var newDataEmbedSet = dataEmbedSet.split("?")[0];
                var urlWatch = "https://www.youtube.com/watch?v=" + newDataEmbedSet;

                var embedResponsiveItem = document.createElement("div");
                var youTubePlayBtn = document.createElement("div");
                var videoLoader = document.createElement("span");
                var videoLoaderIcon = document.createElement("i");
                var videoTitle = document.createElement("span");
                var playIconWrapper = document.createElement("div");
                playIconWrapper.setAttribute("class", "icon-video-play");
                playIconWrapper.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" class="play-circle-outline">
                  <g transform="translate(-62 -62)">
                    <path class="icon-video-circle" d="M116,90a26,26,0,1,0-26,26A26.007,26.007,0,0,0,116,90Z" fill="none" stroke-miterlimit="10" stroke-width="4"/>
                    <path class="icon-video-play" d="M202.028,195.714l14.223-8.592a1.353,1.353,0,0,0,0-2.311l-14.223-8.592A1.34,1.34,0,0,0,200,177.375v17.182a1.34,1.34,0,0,0,2.028,1.157Z" transform="translate(-116.752 -95.966)"/>
                  </g>
                </svg>`;
                var playIcon = playIconWrapper.firstElementChild;
                videoLoader.classList.add("video-loader");
                videoLoaderIcon.classList.add("ion-loading-ch");
                videoTitle.classList.add("embed-title-text");
                embedResponsiveItem.classList.add("video-item", "to-remove");
                youTubePlayBtn.classList.add("youtube-play", "has-outline");
                youTubePlayBtn.setAttribute("tabindex", "-1");
                youTubePlayBtn.appendChild(playIcon);

                var image = new Image();
                image.classList.add("img-fluid");
                image.setAttribute("loading", "lazy");

                // --- REŠENJE ZA 404: PRVO PITAMO API ZA ISPRAVAN THUMBNAIL ---
                fetch("https://noembed.com/embed?format=json&url=" + encodeURIComponent(urlWatch))
                    .then((response) => response.json())
                    .then((data) => {
                        // YouTube preko NoEmbed-a uvek vraća sliku koja postoji (npr. hqdefault.jpg)
                        // i nikada ne daje 404 u konzoli jer ne "nagađamo" maxresdefault
                        image.src = data.thumbnail_url;

                        var titleText = data.title ? `Vorschau des Videos ${data.title}` : "Embed Thumbnails";
                        element.setAttribute("data-title", data.title || "");

                        if (element.classList.contains("without-play-btn")) {
                            image.setAttribute("alt", titleText);
                        } else {
                            thumb.setAttribute("aria-label", data.title || "Embed Video");
                            image.setAttribute("alt", titleText);
                        }

                        if (!thumb.querySelector(".video-title-overlay")) {
                            var titleOverlay = document.createElement("span");
                            titleOverlay.classList.add("video-title-overlay", "visually-hidden");
                            titleOverlay.textContent = data.title || "Embed Video";
                            titleOverlay.style.color = "black";
                            titleOverlay.style.backgroundColor = "white";
                            thumb.appendChild(titleOverlay);
                        }
                    })
                    .catch((err) => {
                        // Backup samo ako NoEmbed padne, koristimo proverenu veličinu
                        image.src = "https://img.youtube.com/vi/" + newDataEmbedSet + "/hqdefault.jpg";
                        image.setAttribute("alt", "Embed Thumbnails");
                    });

                var existingItems = thumb.querySelectorAll(".video-item");
                existingItems.forEach((item, index) => {
                    if (index > 0) { item.remove(); }
                });

                thumb.appendChild(embedResponsiveItem);
                embedResponsiveItem.appendChild(image);
                if (!element.classList.contains("without-play-btn")) {
                    embedResponsiveItem.appendChild(youTubePlayBtn);
                }

                document.querySelectorAll(".cookie-accept").forEach(item => item.remove());
                document.querySelectorAll(".video").forEach(item => item.classList.remove("pointer-events-none"));

                thumb.addEventListener("click", function () {
                    var dataSetEmbed = this.getAttribute("data-embed");
                    var questionMark = dataSetEmbed.indexOf("?") != -1 ? "&" : "?";
                    var videoFormat = this.classList.contains("1by1") ? "&w=480&h=853" : "";
                    var iframe = document.createElement("iframe");
                    iframe.classList.add("video-item");
                    iframe.setAttribute("frameborder", "0");
                    iframe.setAttribute("allow", "autoplay; encrypted-media; allowfullscreen");
                    iframe.setAttribute("src", "https://www.youtube.com/embed/" + dataSetEmbed + questionMark + "rel=0&autoplay=1&controls=1" + videoFormat);

                    var allIframes = document.querySelectorAll(".video-youtube iframe");
                    allIframes.forEach(ifrm => ifrm.remove());

                    //this.innerHTML = "";
                    this.appendChild(iframe);
                    container.classList.remove('video-play')
                    this.classList.add('video-play')
                });
            });
        } else {
            (function () {
                var vimeo = document.querySelectorAll(".video-vimeo");
                vimeo.forEach(function (element) {
                    var vimeoVideoID = element.getAttribute("data-embed-full");
                    var dataPlayIcon = element.getAttribute("data-play-icon");
                    var embedResponsiveItem = document.createElement("div");
                    var vimeoSpanPlay = document.createElement("span");
                    var videoLoader = document.createElement("span");
                    var videoLoaderIcon = document.createElement("i");
                    var playIconWrapper = document.createElement("div");
                    playIconWrapper.setAttribute("class", "icon-video-play");
                    playIconWrapper.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" class="play-circle-outline">
                      <g transform="translate(-62 -62)">
                        <path class="icon-video-circle" data-name="Pfad 84"
                          d="M116,90a26,26,0,1,0-26,26A26.007,26.007,0,0,0,116,90Z"
                          transform="translate(0 0)" fill="none"
                          stroke-miterlimit="10" stroke-width="4"/>
                        <path class="icon-video-play" data-name="Pfad 85"
                          d="M202.028,195.714l14.223-8.592a1.353,1.353,0,0,0,0-2.311l-14.223-8.592A1.34,1.34,0,0,0,200,177.375v17.182a1.34,1.34,0,0,0,2.028,1.157Z"
                          transform="translate(-116.752 -95.966)"/>
                      </g>
                    </svg>`;
                    var playIcon = playIconWrapper.firstElementChild;
                    videoLoader.classList.add("video-loader");
                    videoLoaderIcon.classList.add("ion-loading-ch");
                    var originalString = vimeoVideoID;
                    var substring = "https://vimeo.com/";
                    var substringW = "https://www.vimeo.com/";
                    var newString = originalString;
                    if (originalString.indexOf(substring) !== -1) {
                        newString = originalString.replace(substring, "");
                    } else if (originalString.indexOf(substringW) !== -1) {
                        newString = originalString.replace(substringW, "");
                    }
                    var slash = "/";
                    var newStringRemoveSlashId;
                    if (newString.indexOf(slash) !== -1) {
                        var newStringSlash = newString.substring(0, newString.lastIndexOf(slash) + 1);
                        newStringRemoveSlashId = newStringSlash.replace(slash, "");
                    } else {
                        newStringRemoveSlashId = newString;
                    }
                    element.setAttribute("data-embed", newStringRemoveSlashId);
                    document.querySelectorAll(".cookie-accept").forEach(function (item) {
                        item.remove();
                    });
                    document.querySelectorAll(".video").forEach(function (item) {
                        item.classList.remove("pointer-events-none");
                    });
                    var vimeoUrl = element.getAttribute("data-embed-full");
                    var urlParts = vimeoUrl.replace(/\/$/, "").split('/');
                    var vimeoID = urlParts[urlParts.length - 1];
                    element.setAttribute("data-embed", vimeoID);
                    fetch("https://vimeo.com/api/oembed.json?url=" + encodeURIComponent(vimeoUrl))
                        .then((response) => response.json())
                        .then((data) => {
                            var thumbImg = document.createElement("img");
                            thumbImg.src = data.thumbnail_url;
                            thumbImg.classList.add("vimeo-thumbs", "img-fluid");
                            thumbImg.alt = data.title || "Vimeo Preview";
                            thumbImg.loading = "lazy";
                            embedResponsiveItem.classList.add("video-item");
                            vimeoSpanPlay.classList.add("vimeo-play");
                            vimeoSpanPlay.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" class="play-circle-outline">
                              <g transform="translate(-62 -62)">
                                <path class="icon-video-circle" data-name="Pfad 84"
                                  d="M116,90a26,26,0,1,0-26,26A26.007,26.007,0,0,0,116,90Z"
                                  transform="translate(0 0)" fill="none"
                                  stroke-miterlimit="10" stroke-width="4"/>
                                <path class="icon-video-play" data-name="Pfad 85"
                                  d="M202.028,195.714l14.223-8.592a1.353,1.353,0,0,0,0-2.311l-14.223-8.592A1.34,1.34,0,0,0,200,177.375v17.182a1.34,1.34,0,0,0,2.028,1.157Z"
                                  transform="translate(-116.752 -95.966)"/>
                              </g>
                            </svg>`;
                            embedResponsiveItem.appendChild(thumbImg);
                            if (!element.classList.contains("without-play-btn")) {
                                embedResponsiveItem.appendChild(vimeoSpanPlay);
                            }
                            element.querySelectorAll(".video-item").forEach(el => el.remove());
                            element.appendChild(embedResponsiveItem);
                        })
                        .catch((error) => console.error("Vimeo fetch error:", error));
                    element.addEventListener("click", function () {
                        var embedItem = element.querySelector(".video-item");
                        if (embedItem) {
                            embedItem.classList.add("to-remove");
                        }
                        var dataEmbedFull = element.getAttribute("data-embed-full");
                        var originalString = dataEmbedFull;
                        var substring = "https://vimeo.com/";
                        var substringW = "https://www.vimeo.com/";
                        var slash = "/";
                        var newString = originalString;
                        if (originalString.indexOf(substring) !== -1) {
                            newString = originalString.replace(substring, "");
                        } else if (originalString.indexOf(substringW) !== -1) {
                            newString = originalString.replace(substringW, "");
                        }
                        var newStringSlash;
                        if (newString.indexOf(slash) !== -1) {
                            newStringSlash = newString.replace(slash, "?h=");
                        } else {
                            newStringSlash = newString;
                        }
                        var iframe = document.createElement("iframe");
                        iframe.classList.add("video-item");
                        iframe.setAttribute("frameborder", "0");
                        iframe.setAttribute("allowfullscreen", "");
                        iframe.setAttribute("webkitallowfullscreen", "");
                        iframe.setAttribute("mozallowfullscreen", "");
                        iframe.setAttribute("allow", "autoplay");
                        if (newString.indexOf(slash) !== -1) {
                            iframe.setAttribute(
                                "src",
                                "https://player.vimeo.com/video/" + newStringSlash + "&amp;autoplay=true"
                            );
                        } else {
                            iframe.setAttribute(
                                "src",
                                "https://player.vimeo.com/video/" +
                                newStringSlash +
                                "?title=1&amp;byline=1&amp;autoplay=true"
                            );
                        }
                        var existingItems = element.querySelectorAll(".video-item");
                        existingItems.forEach((item) => item.remove());
                        element.appendChild(iframe);
                        var playButton = element.querySelector(".vimeo-play");
                        if (playButton) {
                            playButton.style.display = "none";
                        }
                        var toRemove = element.querySelectorAll(".to-remove");
                        toRemove.forEach(function (el) {
                            el.remove();
                        });
                    });
                    element.addEventListener("keypress", function (event) {
                        if (event.key === "Enter") {
                            element.click();
                        }
                    });
                });
            })();
        }
    });
}

// startVideo();
