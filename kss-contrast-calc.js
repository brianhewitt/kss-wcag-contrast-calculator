var tempRgbArray = [];
        
        // calculate color luminance. Note that this uses ecmascript6 "map" method, so requies new-ish browsers
        function luminance(r, g, b) {
            var a = [r,g,b].map(function(v) {
                v /= 255;
                return (v <= 0.03928) ?
                    v / 12.92 :
                    Math.pow( ((v+0.055)/1.055), 2.4 );
                });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        // compare luminances
        function compareLuminance(luminance1, luminance2) {
            var colorRatio;
            // console.log("lum 1:" + luminance1 + ", lum2:" + luminance2);
            if (luminance1 >= luminance2) {
                colorRatio = luminance1 / luminance2;
                //console.log("lum1 greater");
            }
    
            else {
                colorRatio = luminance2 / luminance1;
                //console.log("lum2 greater");
            }

            return colorRatio;
        }

        // set colors as rgb arrays
        function getRgbArray(rgbStr) {
            var rgbString = rgbStr.slice(4,-1);
            var rgbArray = rgbString.split(", ");
            return rgbArray;
        }

        // set luminance of default text color (uses $darkest-grey)
        function setTextColorLuminance() {
            var darkestGreyColor = $(".colors-darkest-grey").css("background-color");
            var darkestGreyArray = getRgbArray(darkestGreyColor);
            var darkestGreyLum = luminance(darkestGreyArray[0], darkestGreyArray[1], darkestGreyArray[2]);
            return darkestGreyLum;
        }

        // set default comparison luminances
        var whiteLuminance = luminance(255,255,255);
        var textColorLuminance = setTextColorLuminance();

        $(document).ready(function(){
            $("div.colors").each(function(){
                var tempColor = $(this).css("background-color"); // retrieves RGB value by default
                // console.log("tempColor=" + tempColor);
                tempRgbArray = getRgbArray(tempColor);
                // console.log("tempRgbArray=" + tempRgbArray);
                tempLuminance = (luminance(tempRgbArray[0], tempRgbArray[1], tempRgbArray[2])) + 0.05;
                // console.log("tempLuminance=" + tempLuminance);
                var colorRatio_white = compareLuminance(tempLuminance, whiteLuminance);
                var colorRatio_text = compareLuminance(tempLuminance, textColorLuminance);
                var colorRatio_white_rnd = Math.round(colorRatio_white * 10) / 10;
                var colorRatio_text_rnd = Math.round(colorRatio_text * 10) / 10;
                // console.log("white contrast:" + colorRatio_white_rnd);
                console.log("text contrast:" + colorRatio_text_rnd );

                var wcagStatusDiv_white = '<span class="kss-color-status kss-color-status--white"></span>';
                var wcagStatusDiv_text = '<span class="kss-color-status kss-color-status--text"></span>';

                $(this).next(".kss-wcag").find(".kss-wcag-contrast-white").text(colorRatio_white_rnd);
                $(this).next(".kss-wcag").find(".kss-wcag-contrast-white").prepend(wcagStatusDiv_white);
                if ( colorRatio_white_rnd >=4.5 ) {
                    $(this).next(".kss-wcag").find(".kss-color-status--white").addClass("wcag-aa-pass").addClass("icon_like");
                }

                else if (colorRatio_white_rnd >= 3 ) {
                    $(this).next(".kss-wcag").find(".kss-color-status--white").addClass("wcag-a-pass").addClass("icon_like");
                }

                else {
                    $(this).next(".kss-wcag").find(".kss-color-status--white").addClass("icon_dislike");
                }

                $(this).next(".kss-wcag").find(".kss-wcag-contrast-text").text(colorRatio_text_rnd);
                $(this).next(".kss-wcag").find(".kss-wcag-contrast-text").prepend(wcagStatusDiv_text);
                if ( colorRatio_text_rnd >=4.5 ) {
                    $(this).next(".kss-wcag").find(".kss-color-status--text").addClass("wcag-aa-pass").addClass("icon_like");
                }

                else if (colorRatio_text_rnd >= 3 ) {
                    $(this).next(".kss-wcag").find(".kss-color-status--text").addClass("wcag-a-pass").addClass("icon_like");
                }

                else {
                    $(this).next(".kss-wcag").find(".kss-color-status--text").addClass("icon_dislike");
                }
            });
        });
