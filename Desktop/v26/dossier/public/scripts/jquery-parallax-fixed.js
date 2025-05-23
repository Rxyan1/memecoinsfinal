"use client"
  // Fixed version of the parallax plugin
;(($, window, document, undefined) => {
  // Strict Mode
  var NAME = "parallax"
  var MAGIC_NUMBER = 30
  var DEFAULTS = {
    relativeInput: false,
    clipRelativeInput: false,
    calibrationThreshold: 100,
    calibrationDelay: 500,
    supportDelay: 500,
    calibrateX: false,
    calibrateY: true,
    invertX: true,
    invertY: true,
    limitX: false,
    limitY: false,
    scalarX: 10.0,
    scalarY: 10.0,
    frictionX: 0.1,
    frictionY: 0.1,
    originX: 0.5,
    originY: 0.5,
    pointerEvents: true,
    precision: 1,
  }

  function Plugin(element, options) {
    // DOM Context
    this.element = element
    this.$context = $(element).data("api", this)
    this.$layers = this.$context.find(".layer")

    // Data Extraction
    var data = {
      calibrateX: this.$context.data("calibrate-x") || null,
      calibrateY: this.$context.data("calibrate-y") || null,
      invertX: this.$context.data("invert-x") || null,
      invertY: this.$context.data("invert-y") || null,
      limitX: Number.parseFloat(this.$context.data("limit-x")) || null,
      limitY: Number.parseFloat(this.$context.data("limit-y")) || null,
      scalarX: Number.parseFloat(this.$context.data("scalar-x")) || null,
      scalarY: Number.parseFloat(this.$context.data("scalar-y")) || null,
      frictionX: Number.parseFloat(this.$context.data("friction-x")) || null,
      frictionY: Number.parseFloat(this.$context.data("friction-y")) || null,
      originX: Number.parseFloat(this.$context.data("origin-x")) || null,
      originY: Number.parseFloat(this.$context.data("origin-y")) || null,
      pointerEvents: this.$context.data("pointer-events") || true,
      precision: Number.parseFloat(this.$context.data("precision")) || 1,
    }

    // Delete Null Data Values
    for (var key in data) {
      if (data[key] === null) delete data[key]
    }

    // Compose Settings Object
    $.extend(this, DEFAULTS, options, data)

    // States
    this.calibrationTimer = null
    this.calibrationFlag = true
    this.enabled = false
    this.depthsX = []
    this.depthsY = []
    this.raf = null

    // Element Bounds
    this.bounds = null
    this.ex = 0
    this.ey = 0
    this.ew = 0
    this.eh = 0

    // Element Center
    this.ecx = 0
    this.ecy = 0

    // Element Range
    this.erx = 0
    this.ery = 0

    // Calibration
    this.cx = 0
    this.cy = 0

    // Input
    this.ix = 0
    this.iy = 0

    // Motion
    this.mx = 0
    this.my = 0

    // Velocity
    this.vx = 0
    this.vy = 0

    // Callbacks
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this)
    this.onOrientationTimer = this.onOrientationTimer.bind(this)
    this.onCalibrationTimer = this.onCalibrationTimer.bind(this)
    this.onAnimationFrame = this.onAnimationFrame.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)

    // Initialise
    this.initialise()
  }

  Plugin.prototype.extend = () => {
    if (arguments.length > 1) {
      var master = arguments[0]
      for (var i = 1, l = arguments.length; i < l; i++) {
        var object = arguments[i]
        for (var key in object) {
          master[key] = object[key]
        }
      }
    }
  }

  Plugin.prototype.data = function (element, name) {
    return this.deserialize(element.getAttribute("data-" + name))
  }

  Plugin.prototype.deserialize = (value) => {
    if (value === "true") {
      return true
    } else if (value === "false") {
      return false
    } else if (value === "null") {
      return null
    } else if (!isNaN(Number.parseFloat(value)) && isFinite(value)) {
      return Number.parseFloat(value)
    } else {
      return value
    }
  }

  Plugin.prototype.camelCase = (value) =>
    value.replace(/-+(.)?/g, (match, character) => (character ? character.toUpperCase() : ""))

  Plugin.prototype.transformSupport = function (value) {
    var element = document.createElement("div")
    var propertySupport = false
    var propertyValue = null
    var featureSupport = false
    var cssProperty = null
    var jsProperty = null
    for (var i = 0, l = this.vendors.length; i < l; i++) {
      if (this.vendors[i] !== null) {
        cssProperty = this.vendors[i][0] + "transform"
        jsProperty = this.vendors[i][1] + "Transform"
      } else {
        cssProperty = "transform"
        jsProperty = "transform"
      }
      if (element.style[jsProperty] !== undefined) {
        propertySupport = true
        break
      }
    }
    switch (value) {
      case "2D":
        featureSupport = propertySupport
        break
      case "3D":
        if (propertySupport) {
          var body = document.body || document.createElement("body")
          var documentElement = document.documentElement
          var documentOverflow = documentElement.style.overflow
          var isCreatedBody = false
          if (!document.body) {
            isCreatedBody = true
            documentElement.style.overflow = "hidden"
            documentElement.appendChild(body)
            body.style.overflow = "hidden"
            body.style.background = ""
          }
          body.appendChild(element)
          element.style[jsProperty] = "translate3d(1px,1px,1px)"
          propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty)
          featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== "none"
          documentElement.style.overflow = documentOverflow
          body.removeChild(element)
          if (isCreatedBody) {
            body.removeAttribute("style")
            body.parentNode.removeChild(body)
          }
        }
        break
    }
    return featureSupport
  }

  Plugin.prototype.ww = null
  Plugin.prototype.wh = null
  Plugin.prototype.wcx = null
  Plugin.prototype.wcy = null
  Plugin.prototype.wrx = null
  Plugin.prototype.wry = null
  Plugin.prototype.portrait = null
  Plugin.prototype.desktop = !navigator.userAgent.match(
    /(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i,
  )
  Plugin.prototype.vendors = [null, ["-webkit-", "webkit"], ["-moz-", "Moz"], ["-o-", "O"], ["-ms-", "ms"]]
  Plugin.prototype.motionSupport = !!window.DeviceMotionEvent
  Plugin.prototype.orientationSupport = !!window.DeviceOrientationEvent
  Plugin.prototype.orientationStatus = 0
  Plugin.prototype.motionStatus = 0
  Plugin.prototype.propertyCache = {}

  Plugin.prototype.initialise = function () {
    if (Plugin.prototype.transform2DSupport === undefined) {
      Plugin.prototype.transform2DSupport = Plugin.prototype.transformSupport("2D")
      Plugin.prototype.transform3DSupport = Plugin.prototype.transformSupport("3D")
    }

    // Configure Context Styles
    if (this.transform3DSupport) this.accelerate(this.element)
    var style = window.getComputedStyle(this.element)
    if (style.getPropertyValue("position") === "static") {
      this.element.style.position = "relative"
    }

    // Pointer events
    if (!this.pointerEvents) {
      this.element.style.pointerEvents = "none"
    }

    // Setup
    this.updateLayers()
    this.updateDimensions()
    this.enable()
    this.queueCalibration(this.calibrationDelay)
  }

  Plugin.prototype.updateLayers = function () {
    // Cache Layer Elements
    this.layers = this.element.getElementsByClassName("layer")
    this.depthsX = []
    this.depthsY = []

    // Configure Layer Styles
    for (var i = 0, l = this.layers.length; i < l; i++) {
      var layer = this.layers[i]
      if (this.transform3DSupport) this.accelerate(layer)
      layer.style.position = i ? "absolute" : "relative"
      layer.style.display = "block"
      layer.style.left = 0
      layer.style.top = 0

      // Cache Layer Depth
      var depth = this.data(layer, "depth") || 0
      this.depthsX.push(this.data(layer, "depth-x") || depth)
      this.depthsY.push(this.data(layer, "depth-y") || depth)
    }
  }

  Plugin.prototype.updateDimensions = function () {
    this.ww = window.innerWidth
    this.wh = window.innerHeight
    this.wcx = this.ww * this.originX
    this.wcy = this.wh * this.originY
    this.wrx = Math.max(this.wcx, this.ww - this.wcx)
    this.wry = Math.max(this.wcy, this.wh - this.wcy)
  }

  Plugin.prototype.updateBounds = function () {
    this.bounds = this.element.getBoundingClientRect()
    this.ex = this.bounds.left
    this.ey = this.bounds.top
    this.ew = this.bounds.width
    this.eh = this.bounds.height
    this.ecx = this.ew * this.originX
    this.ecy = this.eh * this.originY
    this.erx = Math.max(this.ecx, this.ew - this.ecx)
    this.ery = Math.max(this.ecy, this.eh - this.ecy)
  }

  Plugin.prototype.queueCalibration = function (delay) {
    clearTimeout(this.calibrationTimer)
    this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay)
  }

  Plugin.prototype.enable = function () {
    if (!this.enabled) {
      this.enabled = true
      if (!this.desktop && this.orientationSupport) {
        this.portrait = null
        window.addEventListener("deviceorientation", this.onDeviceOrientation)
        setTimeout(this.onOrientationTimer, this.supportDelay)
      } else if (!this.desktop && this.motionSupport) {
        this.portrait = null
        window.addEventListener("devicemotion", this.onDeviceMotion)
        setTimeout(this.onMotionTimer, this.supportDelay)
      } else {
        this.cx = 0
        this.cy = 0
        this.portrait = false
        window.addEventListener("mousemove", this.onMouseMove)
      }
      window.addEventListener("resize", this.onWindowResize)
      this.raf = requestAnimationFrame(this.onAnimationFrame)
    }
  }

  Plugin.prototype.disable = function () {
    if (this.enabled) {
      this.enabled = false
      if (this.orientationSupport) {
        window.removeEventListener("deviceorientation", this.onDeviceOrientation)
      } else if (this.motionSupport) {
        window.removeEventListener("devicemotion", this.onDeviceMotion)
      } else {
        window.removeEventListener("mousemove", this.onMouseMove)
      }
      window.removeEventListener("resize", this.onWindowResize)
      cancelAnimationFrame(this.raf)
    }
  }

  Plugin.prototype.calibrate = function (x, y) {
    this.calibrateX = x === undefined ? this.calibrateX : x
    this.calibrateY = y === undefined ? this.calibrateY : y
  }

  Plugin.prototype.invert = function (x, y) {
    this.invertX = x === undefined ? this.invertX : x
    this.invertY = y === undefined ? this.invertY : y
  }

  Plugin.prototype.friction = function (x, y) {
    this.frictionX = x === undefined ? this.frictionX : x
    this.frictionY = y === undefined ? this.frictionY : y
  }

  Plugin.prototype.scalar = function (x, y) {
    this.scalarX = x === undefined ? this.scalarX : x
    this.scalarY = y === undefined ? this.scalarY : y
  }

  Plugin.prototype.limit = function (x, y) {
    this.limitX = x === undefined ? this.limitX : x
    this.limitY = y === undefined ? this.limitY : y
  }

  Plugin.prototype.origin = function (x, y) {
    this.originX = x === undefined ? this.originX : x
    this.originY = y === undefined ? this.originY : y
  }

  Plugin.prototype.clamp = (value, min, max) => {
    value = Math.max(value, min)
    value = Math.min(value, max)
    return value
  }

  Plugin.prototype.css = function (element, property, value) {
    var jsProperty = this.propertyCache[property]
    if (!jsProperty) {
      for (var i = 0, l = this.vendors.length; i < l; i++) {
        if (this.vendors[i] !== null) {
          jsProperty = this.camelCase(this.vendors[i][1] + "-" + property)
        } else {
          jsProperty = property
        }
        if (element.style[jsProperty] !== undefined) {
          this.propertyCache[property] = jsProperty
          break
        }
      }
    }
    element.style[jsProperty] = value
  }

  Plugin.prototype.accelerate = function (element) {
    this.css(element, "transform", "translate3d(0,0,0)")
    this.css(element, "transform-style", "preserve-3d")
    this.css(element, "backface-visibility", "hidden")
  }

  Plugin.prototype.setPosition = function (element, x, y) {
    x = x.toFixed(this.precision) + "px"
    y = y.toFixed(this.precision) + "px"
    if (this.transform3DSupport) {
      this.css(element, "transform", "translate3d(" + x + "," + y + ",0)")
    } else if (this.transform2DSupport) {
      this.css(element, "transform", "translate(" + x + "," + y + ")")
    } else {
      element.style.left = x
      element.style.top = y
    }
  }

  Plugin.prototype.onOrientationTimer = function () {
    if (this.orientationSupport && this.orientationStatus === 0) {
      this.disable()
      this.orientationSupport = false
      this.enable()
    }
  }

  Plugin.prototype.onMotionTimer = function () {
    if (this.motionSupport && this.motionStatus === 0) {
      this.disable()
      this.motionSupport = false
      this.enable()
    }
  }

  Plugin.prototype.onCalibrationTimer = function () {
    this.calibrationFlag = true
  }

  Plugin.prototype.onWindowResize = function () {
    this.updateDimensions()
  }

  Plugin.prototype.onAnimationFrame = function () {
    this.updateBounds()
    var dx = this.ix - this.cx
    var dy = this.iy - this.cy
    if (Math.abs(dx) > this.calibrationThreshold || Math.abs(dy) > this.calibrationThreshold) {
      this.queueCalibration(0)
    }
    if (this.portrait) {
      this.mx = this.calibrateX ? dy : this.iy
      this.my = this.calibrateY ? dx : this.ix
    } else {
      this.mx = this.calibrateX ? dx : this.ix
      this.my = this.calibrateY ? dy : this.iy
    }
    this.mx *= this.ew * (this.scalarX / 100)
    this.my *= this.eh * (this.scalarY / 100)
    if (!isNaN(Number.parseFloat(this.limitX))) {
      this.mx = this.clamp(this.mx, -this.limitX, this.limitX)
    }
    if (!isNaN(Number.parseFloat(this.limitY))) {
      this.my = this.clamp(this.my, -this.limitY, this.limitY)
    }
    this.vx += (this.mx - this.vx) * this.frictionX
    this.vy += (this.my - this.vy) * this.frictionY
    for (var i = 0, l = this.layers.length; i < l; i++) {
      var layer = this.layers[i]
      var depthX = this.depthsX[i]
      var depthY = this.depthsY[i]
      var xOffset = this.vx * (depthX * (this.invertX ? -1 : 1))
      var yOffset = this.vy * (depthY * (this.invertY ? -1 : 1))
      this.setPosition(layer, xOffset, yOffset)
    }
    this.raf = requestAnimationFrame(this.onAnimationFrame)
  }

  Plugin.prototype.rotate = function (beta, gamma) {
    // Extract Rotation
    var x = (beta || 0) / MAGIC_NUMBER
    var y = (gamma || 0) / MAGIC_NUMBER

    // Detect Orientation Change
    var portrait = this.wh > this.ww
    if (this.portrait !== portrait) {
      this.portrait = portrait
      this.calibrationFlag = true
    }

    // Set Calibration
    if (this.calibrationFlag) {
      this.calibrationFlag = false
      this.cx = x
      this.cy = y
    }

    // Set Input
    this.ix = x
    this.iy = y
  }

  Plugin.prototype.onDeviceOrientation = function (event) {
    // Validate environment and event properties.
    var beta = event.beta
    var gamma = event.gamma
    if (!this.desktop && beta !== null && gamma !== null) {
      // Set orientation status.
      this.orientationStatus = 1
      this.rotate(beta, gamma)
    }
  }

  Plugin.prototype.onDeviceMotion = function (event) {
    // Validate environment and event properties.
    var beta = event.rotationRate.beta
    var gamma = event.rotationRate.gamma
    if (!this.desktop && beta !== null && gamma !== null) {
      // Set motion status.
      this.motionStatus = 1
      this.rotate(beta, gamma)
    }
  }

  Plugin.prototype.onMouseMove = function (event) {
    // Cache mouse coordinates.
    var clientX = event.clientX
    var clientY = event.clientY

    // Calculate Mouse Input
    if (!this.orientationSupport && this.relativeInput) {
      // Clip mouse coordinates inside element bounds.
      if (this.clipRelativeInput) {
        clientX = Math.max(clientX, this.ex)
        clientX = Math.min(clientX, this.ex + this.ew)
        clientY = Math.max(clientY, this.ey)
        clientY = Math.min(clientY, this.ey + this.eh)
      }
      // Calculate input relative to the element.
      this.ix = (clientX - this.ex - this.ecx) / this.erx
      this.iy = (clientY - this.ey - this.ecy) / this.ery
    } else {
      // Calculate input relative to the window.
      this.ix = (clientX - this.wcx) / this.wrx
      this.iy = (clientY - this.wcy) / this.wry
    }
  }

  var API = {
    enable: Plugin.prototype.enable,
    disable: Plugin.prototype.disable,
    updateLayers: Plugin.prototype.updateLayers,
    calibrate: Plugin.prototype.calibrate,
    friction: Plugin.prototype.friction,
    invert: Plugin.prototype.invert,
    scalar: Plugin.prototype.scalar,
    limit: Plugin.prototype.limit,
    origin: Plugin.prototype.origin,
  }

  $.fn[NAME] = function (value) {
    var args = arguments
    return this.each(function () {
      var $this = $(this)
      var plugin = $this.data(NAME)
      if (!plugin) {
        plugin = new Plugin(this, value)
        $this.data(NAME, plugin)
      }
      if (API[value]) {
        plugin[value].apply(plugin, Array.prototype.slice.call(args, 1))
      }
    })
  }
})(window.jQuery || window.Zepto, window, document)

// Request Animation Frame Polyfill
;(() => {
  var lastTime = 0
  var vendors = ["ms", "moz", "webkit", "o"]

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"]
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"]
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback) => {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
      var id = window.setTimeout(() => {
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id) => {
      clearTimeout(id)
    }
  }
})()
