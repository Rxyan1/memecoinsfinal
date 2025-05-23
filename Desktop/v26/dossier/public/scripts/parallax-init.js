// This script initializes the parallax plugin
;((window) => {
  // Store the original jQuery
  if (typeof window.jQuery !== "undefined") {
    // Make sure $ is defined
    window.$ = window.jQuery

    // Define the parallax plugin
    ;(($) => {
      $.fn.parallax = function (options) {
        var $this = $(this)
        var $layers = $this.find(".layer")

        // Default settings
        var settings = $.extend(
          {
            frictionX: Number.parseFloat($this.data("friction-x")) || 0.1,
            frictionY: Number.parseFloat($this.data("friction-y")) || 0.1,
            scalarX: Number.parseFloat($this.data("scalar-x")) || 10,
            scalarY: Number.parseFloat($this.data("scalar-y")) || 10,
          },
          options,
        )

        // Initialize layers
        $layers.css({
          position: "absolute",
          display: "block",
          left: 0,
          top: 0,
        })

        // First layer is relative
        $layers.first().css({
          position: "relative",
        })

        // Store depths
        var depths = []
        $layers.each(function () {
          depths.push(Number.parseFloat($(this).data("depth")) || 0)
        })

        // Mouse move handler
        $(window).on("mousemove", (e) => {
          var windowWidth = $(window).width()
          var windowHeight = $(window).height()

          // Calculate center position
          var centerX = windowWidth / 2
          var centerY = windowHeight / 2

          // Calculate mouse offset from center
          var offsetX = (e.clientX - centerX) / centerX
          var offsetY = (e.clientY - centerY) / centerY

          // Apply movement to each layer
          $layers.each(function (index) {
            var depth = depths[index]
            var translateX = offsetX * settings.scalarX * depth
            var translateY = offsetY * settings.scalarY * depth

            // Apply transform
            $(this).css({
              transform: "translate3d(" + translateX + "px, " + translateY + "px, 0)",
            })
          })
        })

        return this
      }
    })(window.jQuery)

    console.log("Parallax plugin defined successfully")
  } else {
    console.error("jQuery not found when initializing parallax")
  }
})(window)
