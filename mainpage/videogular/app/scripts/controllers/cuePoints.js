'use strict';
angular.module('myApp').controller('CuePointsCtrl',
    function ($sce) {
        this.consoleCuePointsMessages = "click play to see cue points bindings!\n";
        this.API = null;
        this.barChartStyle = {};
        this.textStyle = {};
        this.chapterSelected = {};

        this.onPlayerReady = function (API) {
            this.API = API;
        };

        this.media = [
            {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
                        type: "video/mp4"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
                        type: "video/ogg"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
                        type: "video/webm"
                    }
                ],
                tracks: [
                    {
                        src: "assets/subs/pale-blue-dot.vtt",
                        kind: "captions",
                        srclang: "en",
                        label: "English",
                        default: "default"
                    }
                ]
            }
        ];

        // Console
        this.onConsoleCuePoint = function onConsoleCuePoint(currentTime, timeLapse, params) {
            var percent = (currentTime - timeLapse.start) * 100 / (timeLapse.end - timeLapse.start);
            this.consoleCuePointsMessages = "time: " + currentTime + " -> (start/end/percent) " + timeLapse.start + "/" + timeLapse.end + "/" + percent + "% = " + params.message + "\n";
        };

        // Animations
        this.onEnterAnimationsCuePoint = function onEnterAnimationsCuePoint(currentTime, timeLapse, params) {
            console.log("entering in animation!");
            params.prop[params.value] = "0" + params.units;
        };

        this.onLeaveAnimationsCuePoint = function onLeaveAnimationsCuePoint(currentTime, timeLapse, params) {
            params.prop[params.value] = "0" + params.units;
        };

        this.onUpdateAnimationsCuePoint = function onUpdateAnimationsCuePoint(currentTime, timeLapse, params) {
            var percent = (currentTime - timeLapse.start) * 100 / (timeLapse.end - timeLapse.start);
            var value = params.final * percent / 100;

            params.prop[params.value] = value + params.units;
        };

        this.onCompleteAnimationsCuePoint = function onCompleteAnimationsCuePoint(currentTime, timeLapse, params) {
            params.prop[params.value] = params.final + params.units;
        };

        // Chapters
        this.onChaptersCuePoint = function onChaptersCuePoint(currentTime, timeLapse, params) {
            this.chapterSelected = this.config.cuePoints.chapters[params.index];
        };

        this.onChangeChapter = function onChangeChapter() {
            this.API.seekTime(this.chapterSelected.value);
        };

        this.changeCuePoints = function changeCuePoints() {
            this.config.cuePoints = {
                console: [
                    {
                        timeLapse: {
                            start: 30
                        },
                        onEnter: this.onConsoleCuePoint.bind(this),
                        onLeave: this.onConsoleCuePoint.bind(this),
                        onUpdate: this.onConsoleCuePoint.bind(this),
                        onComplete: this.onConsoleCuePoint.bind(this),
                        params: {
                            message: "you can change cue points on the fly!"
                        }
                    },
                    {
                        timeLapse: {
                            start: 34
                        },
                        onEnter: this.onConsoleCuePoint.bind(this),
                        onLeave: this.onConsoleCuePoint.bind(this),
                        onUpdate: this.onConsoleCuePoint.bind(this),
                        onComplete: this.onConsoleCuePoint.bind(this),
                        params: {
                            message: "because cue points are awesome!"
                        }
                    },
                    {
                        timeLapse: {
                            start: 40
                        },
                        onEnter: this.onConsoleCuePoint.bind(this),
                        onLeave: this.onConsoleCuePoint.bind(this),
                        onUpdate: this.onConsoleCuePoint.bind(this),
                        onComplete: this.onConsoleCuePoint.bind(this),
                        params: {
                            message: "yay!! ^_^"
                        }
                    }
                ]
            };
        };

        this.config = {
            playsInline: false,
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: false,
            sources: this.media[0].sources,
            tracks: this.media[0].tracks,
            loop: false,
            preload: "auto",
            controls: false,
            theme: {
                url: "styles/themes/default/videogular.css"
            },
            cuePoints: {
                console: [
                    {
                        timeLapse: {
                            start: 0
                        },
                        onEnter: this.onConsoleCuePoint.bind(this),
                        onLeave: this.onConsoleCuePoint.bind(this),
                        onUpdate: this.onConsoleCuePoint.bind(this),
                        onComplete: this.onConsoleCuePoint.bind(this),
                        params: {
                            message: "hello dude!"
                        }
                    },
                    {
                        timeLapse: {
                            start: 4
                        },
                        onEnter: this.onConsoleCuePoint.bind(this),
                        onLeave: this.onConsoleCuePoint.bind(this),
                        onUpdate: this.onConsoleCuePoint.bind(this),
                        onComplete: this.onConsoleCuePoint.bind(this),
                        params: {
                            message: "cue points are awesome"
                        }
                    },
                    {
                        timeLapse: {
                            start: 10
                        },
                        onEnter: this.onConsoleCuePoint.bind(this),
                        onLeave: this.onConsoleCuePoint.bind(this),
                        onUpdate: this.onConsoleCuePoint.bind(this),
                        onComplete: this.onConsoleCuePoint.bind(this),
                        params: {
                            message: "(????????????)???"
                        }
                    }
                ],
                animations: [
                    {
                        timeLapse: {
                            start: 14,
                            end: 16
                        },
                        onEnter: this.onEnterAnimationsCuePoint.bind(this),
                        onLeave: this.onLeaveAnimationsCuePoint.bind(this),
                        onUpdate: this.onUpdateAnimationsCuePoint.bind(this),
                        onComplete: this.onCompleteAnimationsCuePoint.bind(this),
                        params: {
                            final: 500,
                            prop: this.barChartStyle,
                            value: "width",
                            units: "px"
                        }
                    },
                    {
                        timeLapse: {
                            start: 50,
                            end: 58
                        },
                        onEnter: this.onEnterAnimationsCuePoint.bind(this),
                        onLeave: this.onLeaveAnimationsCuePoint.bind(this),
                        onUpdate: this.onUpdateAnimationsCuePoint.bind(this),
                        onComplete: this.onCompleteAnimationsCuePoint.bind(this),
                        params: {
                            final: 1,
                            prop: this.textStyle,
                            value: "opacity",
                            units: ""
                        }
                    }
                ],
                chapters: [
                    {
                        timeLapse: {
                            start: 7
                        },
                        onEnter: this.onChaptersCuePoint.bind(this),
                        onLeave: this.onChaptersCuePoint.bind(this),
                        onUpdate: this.onChaptersCuePoint.bind(this),
                        onComplete: this.onChaptersCuePoint.bind(this),
                        params: {
                            index: 0,
                            label: "Chapter 1: Title",
                            value: 7
                        }
                    },
                    {
                        timeLapse: {
                            start: 14
                        },
                        onEnter: this.onChaptersCuePoint.bind(this),
                        onLeave: this.onChaptersCuePoint.bind(this),
                        onUpdate: this.onChaptersCuePoint.bind(this),
                        onComplete: this.onChaptersCuePoint.bind(this),
                        params: {
                            index: 1,
                            label: "Chapter 2: The Earth",
                            value: 14
                        }
                    },
                    {
                        timeLapse: {
                            start: 35
                        },
                        onEnter: this.onChaptersCuePoint.bind(this),
                        onLeave: this.onChaptersCuePoint.bind(this),
                        onUpdate: this.onChaptersCuePoint.bind(this),
                        onComplete: this.onChaptersCuePoint.bind(this),
                        params: {
                            index: 2,
                            label: "Chapter 3: Everyone you know",
                            value: 35
                        }
                    },
                    {
                        timeLapse: {
                            start: 90
                        },
                        onEnter: this.onChaptersCuePoint.bind(this),
                        onLeave: this.onChaptersCuePoint.bind(this),
                        onUpdate: this.onChaptersCuePoint.bind(this),
                        onComplete: this.onChaptersCuePoint.bind(this),
                        params: {
                            index: 3,
                            label: "Chapter 4: Credits",
                            value: 90
                        }
                    }
                ],
                thumbnails: [
                    {
                        timeLapse: {
                            start: 30
                        },
                        params: {
                            thumbnail: "assets/thumbnails/30.png"
                        }
                    },
                    {
                        timeLapse: {
                            start: 49,
                            end: 60
                        },
                        params: {
                            thumbnail: "assets/thumbnails/50.png"
                        }
                    }
                ]
            },
            plugins: {
                poster: {
                    url: "assets/images/videogular.png"
                }
            }
        };
    }
);
