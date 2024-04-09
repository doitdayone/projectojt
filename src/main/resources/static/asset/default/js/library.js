/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
!(function (a, b, c, d) {
  function e(b, c) {
    (this.settings = null),
      (this.options = a.extend({}, e.Defaults, c)),
      (this.$element = a(b)),
      (this._handlers = {}),
      (this._plugins = {}),
      (this._supress = {}),
      (this._current = null),
      (this._speed = null),
      (this._coordinates = []),
      (this._breakpoint = null),
      (this._width = null),
      (this._items = []),
      (this._clones = []),
      (this._mergers = []),
      (this._widths = []),
      (this._invalidated = {}),
      (this._pipe = []),
      (this._drag = {
        time: null,
        target: null,
        pointer: null,
        stage: { start: null, current: null },
        direction: null,
      }),
      (this._states = {
        current: {},
        tags: {
          initializing: ["busy"],
          animating: ["busy"],
          dragging: ["interacting"],
        },
      }),
      a.each(
        ["onResize", "onThrottledResize"],
        a.proxy(function (b, c) {
          this._handlers[c] = a.proxy(this[c], this);
        }, this)
      ),
      a.each(
        e.Plugins,
        a.proxy(function (a, b) {
          this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this);
        }, this)
      ),
      a.each(
        e.Workers,
        a.proxy(function (b, c) {
          this._pipe.push({ filter: c.filter, run: a.proxy(c.run, this) });
        }, this)
      ),
      this.setup(),
      this.initialize();
  }
  (e.Defaults = {
    items: 3,
    loop: !1,
    center: !1,
    rewind: !1,
    checkVisibility: !0,
    mouseDrag: !0,
    touchDrag: !0,
    pullDrag: !0,
    freeDrag: !1,
    margin: 0,
    stagePadding: 0,
    merge: !1,
    mergeFit: !0,
    autoWidth: !1,
    startPosition: 0,
    rtl: !1,
    smartSpeed: 250,
    fluidSpeed: !1,
    dragEndSpeed: !1,
    responsive: {},
    responsiveRefreshRate: 200,
    responsiveBaseElement: b,
    fallbackEasing: "swing",
    slideTransition: "",
    info: !1,
    nestedItemSelector: !1,
    itemElement: "div",
    stageElement: "div",
    refreshClass: "owl-refresh",
    loadedClass: "owl-loaded",
    loadingClass: "owl-loading",
    rtlClass: "owl-rtl",
    responsiveClass: "owl-responsive",
    dragClass: "owl-drag",
    itemClass: "owl-item",
    stageClass: "owl-stage",
    stageOuterClass: "owl-stage-outer",
    grabClass: "owl-grab",
  }),
    (e.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
    (e.Type = { Event: "event", State: "state" }),
    (e.Plugins = {}),
    (e.Workers = [
      {
        filter: ["width", "settings"],
        run: function () {
          this._width = this.$element.width();
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          a.current = this._items && this._items[this.relative(this._current)];
        },
      },
      {
        filter: ["items", "settings"],
        run: function () {
          this.$stage.children(".cloned").remove();
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this.settings.margin || "",
            c = !this.settings.autoWidth,
            d = this.settings.rtl,
            e = {
              width: "auto",
              "margin-left": d ? b : "",
              "margin-right": d ? "" : b,
            };
          !c && this.$stage.children().css(e), (a.css = e);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b =
              (this.width() / this.settings.items).toFixed(3) -
              this.settings.margin,
            c = null,
            d = this._items.length,
            e = !this.settings.autoWidth,
            f = [];
          for (a.items = { merge: !1, width: b }; d--; )
            (c = this._mergers[d]),
              (c =
                (this.settings.mergeFit && Math.min(c, this.settings.items)) ||
                c),
              (a.items.merge = c > 1 || a.items.merge),
              (f[d] = e ? b * c : this._items[d].width());
          this._widths = f;
        },
      },
      {
        filter: ["items", "settings"],
        run: function () {
          var b = [],
            c = this._items,
            d = this.settings,
            e = Math.max(2 * d.items, 4),
            f = 2 * Math.ceil(c.length / 2),
            g = d.loop && c.length ? (d.rewind ? e : Math.max(e, f)) : 0,
            h = "",
            i = "";
          for (g /= 2; g > 0; )
            b.push(this.normalize(b.length / 2, !0)),
              (h += c[b[b.length - 1]][0].outerHTML),
              b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)),
              (i = c[b[b.length - 1]][0].outerHTML + i),
              (g -= 1);
          (this._clones = b),
            a(h).addClass("cloned").appendTo(this.$stage),
            a(i).addClass("cloned").prependTo(this.$stage);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          for (
            var a = this.settings.rtl ? 1 : -1,
              b = this._clones.length + this._items.length,
              c = -1,
              d = 0,
              e = 0,
              f = [];
            ++c < b;

          )
            (d = f[c - 1] || 0),
              (e = this._widths[this.relative(c)] + this.settings.margin),
              f.push(d + e * a);
          this._coordinates = f;
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function () {
          var a = this.settings.stagePadding,
            b = this._coordinates,
            c = {
              width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
              "padding-left": a || "",
              "padding-right": a || "",
            };
          this.$stage.css(c);
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          var b = this._coordinates.length,
            c = !this.settings.autoWidth,
            d = this.$stage.children();
          if (c && a.items.merge)
            for (; b--; )
              (a.css.width = this._widths[this.relative(b)]),
                d.eq(b).css(a.css);
          else c && ((a.css.width = a.items.width), d.css(a.css));
        },
      },
      {
        filter: ["items"],
        run: function () {
          this._coordinates.length < 1 && this.$stage.removeAttr("style");
        },
      },
      {
        filter: ["width", "items", "settings"],
        run: function (a) {
          (a.current = a.current ? this.$stage.children().index(a.current) : 0),
            (a.current = Math.max(
              this.minimum(),
              Math.min(this.maximum(), a.current)
            )),
            this.reset(a.current);
        },
      },
      {
        filter: ["position"],
        run: function () {
          this.animate(this.coordinates(this._current));
        },
      },
      {
        filter: ["width", "position", "items", "settings"],
        run: function () {
          var a,
            b,
            c,
            d,
            e = this.settings.rtl ? 1 : -1,
            f = 2 * this.settings.stagePadding,
            g = this.coordinates(this.current()) + f,
            h = g + this.width() * e,
            i = [];
          for (c = 0, d = this._coordinates.length; c < d; c++)
            (a = this._coordinates[c - 1] || 0),
              (b = Math.abs(this._coordinates[c]) + f * e),
              ((this.op(a, "<=", g) && this.op(a, ">", h)) ||
                (this.op(b, "<", g) && this.op(b, ">", h))) &&
                i.push(c);
          this.$stage.children(".active").removeClass("active"),
            this.$stage
              .children(":eq(" + i.join("), :eq(") + ")")
              .addClass("active"),
            this.$stage.children(".center").removeClass("center"),
            this.settings.center &&
              this.$stage.children().eq(this.current()).addClass("center");
        },
      },
    ]),
    (e.prototype.initializeStage = function () {
      (this.$stage = this.$element.find("." + this.settings.stageClass)),
        this.$stage.length ||
          (this.$element.addClass(this.options.loadingClass),
          (this.$stage = a("<" + this.settings.stageElement + ">", {
            class: this.settings.stageClass,
          }).wrap(a("<div/>", { class: this.settings.stageOuterClass }))),
          this.$element.append(this.$stage.parent()));
    }),
    (e.prototype.initializeItems = function () {
      var b = this.$element.find(".owl-item");
      if (b.length)
        return (
          (this._items = b.get().map(function (b) {
            return a(b);
          })),
          (this._mergers = this._items.map(function () {
            return 1;
          })),
          void this.refresh()
        );
      this.replace(this.$element.children().not(this.$stage.parent())),
        this.isVisible() ? this.refresh() : this.invalidate("width"),
        this.$element
          .removeClass(this.options.loadingClass)
          .addClass(this.options.loadedClass);
    }),
    (e.prototype.initialize = function () {
      if (
        (this.enter("initializing"),
        this.trigger("initialize"),
        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl),
        this.settings.autoWidth && !this.is("pre-loading"))
      ) {
        var a, b, c;
        (a = this.$element.find("img")),
          (b = this.settings.nestedItemSelector
            ? "." + this.settings.nestedItemSelector
            : d),
          (c = this.$element.children(b).width()),
          a.length && c <= 0 && this.preloadAutoWidthImages(a);
      }
      this.initializeStage(),
        this.initializeItems(),
        this.registerEventHandlers(),
        this.leave("initializing"),
        this.trigger("initialized");
    }),
    (e.prototype.isVisible = function () {
      return !this.settings.checkVisibility || this.$element.is(":visible");
    }),
    (e.prototype.setup = function () {
      var b = this.viewport(),
        c = this.options.responsive,
        d = -1,
        e = null;
      c
        ? (a.each(c, function (a) {
            a <= b && a > d && (d = Number(a));
          }),
          (e = a.extend({}, this.options, c[d])),
          "function" == typeof e.stagePadding &&
            (e.stagePadding = e.stagePadding()),
          delete e.responsive,
          e.responsiveClass &&
            this.$element.attr(
              "class",
              this.$element
                .attr("class")
                .replace(
                  new RegExp(
                    "(" + this.options.responsiveClass + "-)\\S+\\s",
                    "g"
                  ),
                  "$1" + d
                )
            ))
        : (e = a.extend({}, this.options)),
        this.trigger("change", { property: { name: "settings", value: e } }),
        (this._breakpoint = d),
        (this.settings = e),
        this.invalidate("settings"),
        this.trigger("changed", {
          property: { name: "settings", value: this.settings },
        });
    }),
    (e.prototype.optionsLogic = function () {
      this.settings.autoWidth &&
        ((this.settings.stagePadding = !1), (this.settings.merge = !1));
    }),
    (e.prototype.prepare = function (b) {
      var c = this.trigger("prepare", { content: b });
      return (
        c.data ||
          (c.data = a("<" + this.settings.itemElement + "/>")
            .addClass(this.options.itemClass)
            .append(b)),
        this.trigger("prepared", { content: c.data }),
        c.data
      );
    }),
    (e.prototype.update = function () {
      for (
        var b = 0,
          c = this._pipe.length,
          d = a.proxy(function (a) {
            return this[a];
          }, this._invalidated),
          e = {};
        b < c;

      )
        (this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) &&
          this._pipe[b].run(e),
          b++;
      (this._invalidated = {}), !this.is("valid") && this.enter("valid");
    }),
    (e.prototype.width = function (a) {
      switch ((a = a || e.Width.Default)) {
        case e.Width.Inner:
        case e.Width.Outer:
          return this._width;
        default:
          return (
            this._width - 2 * this.settings.stagePadding + this.settings.margin
          );
      }
    }),
    (e.prototype.refresh = function () {
      this.enter("refreshing"),
        this.trigger("refresh"),
        this.setup(),
        this.optionsLogic(),
        this.$element.addClass(this.options.refreshClass),
        this.update(),
        this.$element.removeClass(this.options.refreshClass),
        this.leave("refreshing"),
        this.trigger("refreshed");
    }),
    (e.prototype.onThrottledResize = function () {
      b.clearTimeout(this.resizeTimer),
        (this.resizeTimer = b.setTimeout(
          this._handlers.onResize,
          this.settings.responsiveRefreshRate
        ));
    }),
    (e.prototype.onResize = function () {
      return (
        !!this._items.length &&
        this._width !== this.$element.width() &&
        !!this.isVisible() &&
        (this.enter("resizing"),
        this.trigger("resize").isDefaultPrevented()
          ? (this.leave("resizing"), !1)
          : (this.invalidate("width"),
            this.refresh(),
            this.leave("resizing"),
            void this.trigger("resized")))
      );
    }),
    (e.prototype.registerEventHandlers = function () {
      a.support.transition &&
        this.$stage.on(
          a.support.transition.end + ".owl.core",
          a.proxy(this.onTransitionEnd, this)
        ),
        !1 !== this.settings.responsive &&
          this.on(b, "resize", this._handlers.onThrottledResize),
        this.settings.mouseDrag &&
          (this.$element.addClass(this.options.dragClass),
          this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)),
          this.$stage.on(
            "dragstart.owl.core selectstart.owl.core",
            function () {
              return !1;
            }
          )),
        this.settings.touchDrag &&
          (this.$stage.on(
            "touchstart.owl.core",
            a.proxy(this.onDragStart, this)
          ),
          this.$stage.on(
            "touchcancel.owl.core",
            a.proxy(this.onDragEnd, this)
          ));
    }),
    (e.prototype.onDragStart = function (b) {
      var d = null;
      3 !== b.which &&
        (a.support.transform
          ? ((d = this.$stage
              .css("transform")
              .replace(/.*\(|\)| /g, "")
              .split(",")),
            (d = {
              x: d[16 === d.length ? 12 : 4],
              y: d[16 === d.length ? 13 : 5],
            }))
          : ((d = this.$stage.position()),
            (d = {
              x: this.settings.rtl
                ? d.left +
                  this.$stage.width() -
                  this.width() +
                  this.settings.margin
                : d.left,
              y: d.top,
            })),
        this.is("animating") &&
          (a.support.transform ? this.animate(d.x) : this.$stage.stop(),
          this.invalidate("position")),
        this.$element.toggleClass(
          this.options.grabClass,
          "mousedown" === b.type
        ),
        this.speed(0),
        (this._drag.time = new Date().getTime()),
        (this._drag.target = a(b.target)),
        (this._drag.stage.start = d),
        (this._drag.stage.current = d),
        (this._drag.pointer = this.pointer(b)),
        a(c).on(
          "mouseup.owl.core touchend.owl.core",
          a.proxy(this.onDragEnd, this)
        ),
        a(c).one(
          "mousemove.owl.core touchmove.owl.core",
          a.proxy(function (b) {
            var d = this.difference(this._drag.pointer, this.pointer(b));
            a(c).on(
              "mousemove.owl.core touchmove.owl.core",
              a.proxy(this.onDragMove, this)
            ),
              (Math.abs(d.x) < Math.abs(d.y) && this.is("valid")) ||
                (b.preventDefault(),
                this.enter("dragging"),
                this.trigger("drag"));
          }, this)
        ));
    }),
    (e.prototype.onDragMove = function (a) {
      var b = null,
        c = null,
        d = null,
        e = this.difference(this._drag.pointer, this.pointer(a)),
        f = this.difference(this._drag.stage.start, e);
      this.is("dragging") &&
        (a.preventDefault(),
        this.settings.loop
          ? ((b = this.coordinates(this.minimum())),
            (c = this.coordinates(this.maximum() + 1) - b),
            (f.x = ((((f.x - b) % c) + c) % c) + b))
          : ((b = this.settings.rtl
              ? this.coordinates(this.maximum())
              : this.coordinates(this.minimum())),
            (c = this.settings.rtl
              ? this.coordinates(this.minimum())
              : this.coordinates(this.maximum())),
            (d = this.settings.pullDrag ? (-1 * e.x) / 5 : 0),
            (f.x = Math.max(Math.min(f.x, b + d), c + d))),
        (this._drag.stage.current = f),
        this.animate(f.x));
    }),
    (e.prototype.onDragEnd = function (b) {
      var d = this.difference(this._drag.pointer, this.pointer(b)),
        e = this._drag.stage.current,
        f = (d.x > 0) ^ this.settings.rtl ? "left" : "right";
      a(c).off(".owl.core"),
        this.$element.removeClass(this.options.grabClass),
        ((0 !== d.x && this.is("dragging")) || !this.is("valid")) &&
          (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
          this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)),
          this.invalidate("position"),
          this.update(),
          (this._drag.direction = f),
          (Math.abs(d.x) > 3 || new Date().getTime() - this._drag.time > 300) &&
            this._drag.target.one("click.owl.core", function () {
              return !1;
            })),
        this.is("dragging") &&
          (this.leave("dragging"), this.trigger("dragged"));
    }),
    (e.prototype.closest = function (b, c) {
      var e = -1,
        f = 30,
        g = this.width(),
        h = this.coordinates();
      return (
        this.settings.freeDrag ||
          a.each(
            h,
            a.proxy(function (a, i) {
              return (
                "left" === c && b > i - f && b < i + f
                  ? (e = a)
                  : "right" === c && b > i - g - f && b < i - g + f
                  ? (e = a + 1)
                  : this.op(b, "<", i) &&
                    this.op(b, ">", h[a + 1] !== d ? h[a + 1] : i - g) &&
                    (e = "left" === c ? a + 1 : a),
                -1 === e
              );
            }, this)
          ),
        this.settings.loop ||
          (this.op(b, ">", h[this.minimum()])
            ? (e = b = this.minimum())
            : this.op(b, "<", h[this.maximum()]) && (e = b = this.maximum())),
        e
      );
    }),
    (e.prototype.animate = function (b) {
      var c = this.speed() > 0;
      this.is("animating") && this.onTransitionEnd(),
        c && (this.enter("animating"), this.trigger("translate")),
        a.support.transform3d && a.support.transition
          ? this.$stage.css({
              transform: "translate3d(" + b + "px,0px,0px)",
              transition:
                this.speed() / 1e3 +
                "s" +
                (this.settings.slideTransition
                  ? " " + this.settings.slideTransition
                  : ""),
            })
          : c
          ? this.$stage.animate(
              { left: b + "px" },
              this.speed(),
              this.settings.fallbackEasing,
              a.proxy(this.onTransitionEnd, this)
            )
          : this.$stage.css({ left: b + "px" });
    }),
    (e.prototype.is = function (a) {
      return this._states.current[a] && this._states.current[a] > 0;
    }),
    (e.prototype.current = function (a) {
      if (a === d) return this._current;
      if (0 === this._items.length) return d;
      if (((a = this.normalize(a)), this._current !== a)) {
        var b = this.trigger("change", {
          property: { name: "position", value: a },
        });
        b.data !== d && (a = this.normalize(b.data)),
          (this._current = a),
          this.invalidate("position"),
          this.trigger("changed", {
            property: { name: "position", value: this._current },
          });
      }
      return this._current;
    }),
    (e.prototype.invalidate = function (b) {
      return (
        "string" === a.type(b) &&
          ((this._invalidated[b] = !0),
          this.is("valid") && this.leave("valid")),
        a.map(this._invalidated, function (a, b) {
          return b;
        })
      );
    }),
    (e.prototype.reset = function (a) {
      (a = this.normalize(a)) !== d &&
        ((this._speed = 0),
        (this._current = a),
        this.suppress(["translate", "translated"]),
        this.animate(this.coordinates(a)),
        this.release(["translate", "translated"]));
    }),
    (e.prototype.normalize = function (a, b) {
      var c = this._items.length,
        e = b ? 0 : this._clones.length;
      return (
        !this.isNumeric(a) || c < 1
          ? (a = d)
          : (a < 0 || a >= c + e) &&
            (a = ((((a - e / 2) % c) + c) % c) + e / 2),
        a
      );
    }),
    (e.prototype.relative = function (a) {
      return (a -= this._clones.length / 2), this.normalize(a, !0);
    }),
    (e.prototype.maximum = function (a) {
      var b,
        c,
        d,
        e = this.settings,
        f = this._coordinates.length;
      if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
      else if (e.autoWidth || e.merge) {
        if ((b = this._items.length))
          for (
            c = this._items[--b].width(), d = this.$element.width();
            b-- && !((c += this._items[b].width() + this.settings.margin) > d);

          );
        f = b + 1;
      } else
        f = e.center ? this._items.length - 1 : this._items.length - e.items;
      return a && (f -= this._clones.length / 2), Math.max(f, 0);
    }),
    (e.prototype.minimum = function (a) {
      return a ? 0 : this._clones.length / 2;
    }),
    (e.prototype.items = function (a) {
      return a === d
        ? this._items.slice()
        : ((a = this.normalize(a, !0)), this._items[a]);
    }),
    (e.prototype.mergers = function (a) {
      return a === d
        ? this._mergers.slice()
        : ((a = this.normalize(a, !0)), this._mergers[a]);
    }),
    (e.prototype.clones = function (b) {
      var c = this._clones.length / 2,
        e = c + this._items.length,
        f = function (a) {
          return a % 2 == 0 ? e + a / 2 : c - (a + 1) / 2;
        };
      return b === d
        ? a.map(this._clones, function (a, b) {
            return f(b);
          })
        : a.map(this._clones, function (a, c) {
            return a === b ? f(c) : null;
          });
    }),
    (e.prototype.speed = function (a) {
      return a !== d && (this._speed = a), this._speed;
    }),
    (e.prototype.coordinates = function (b) {
      var c,
        e = 1,
        f = b - 1;
      return b === d
        ? a.map(
            this._coordinates,
            a.proxy(function (a, b) {
              return this.coordinates(b);
            }, this)
          )
        : (this.settings.center
            ? (this.settings.rtl && ((e = -1), (f = b + 1)),
              (c = this._coordinates[b]),
              (c += ((this.width() - c + (this._coordinates[f] || 0)) / 2) * e))
            : (c = this._coordinates[f] || 0),
          (c = Math.ceil(c)));
    }),
    (e.prototype.duration = function (a, b, c) {
      return 0 === c
        ? 0
        : Math.min(Math.max(Math.abs(b - a), 1), 6) *
            Math.abs(c || this.settings.smartSpeed);
    }),
    (e.prototype.to = function (a, b) {
      var c = this.current(),
        d = null,
        e = a - this.relative(c),
        f = (e > 0) - (e < 0),
        g = this._items.length,
        h = this.minimum(),
        i = this.maximum();
      this.settings.loop
        ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g),
          (a = c + e),
          (d = ((((a - h) % g) + g) % g) + h) !== a &&
            d - e <= i &&
            d - e > 0 &&
            ((c = d - e), (a = d), this.reset(c)))
        : this.settings.rewind
        ? ((i += 1), (a = ((a % i) + i) % i))
        : (a = Math.max(h, Math.min(i, a))),
        this.speed(this.duration(c, a, b)),
        this.current(a),
        this.isVisible() && this.update();
    }),
    (e.prototype.next = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) + 1, a);
    }),
    (e.prototype.prev = function (a) {
      (a = a || !1), this.to(this.relative(this.current()) - 1, a);
    }),
    (e.prototype.onTransitionEnd = function (a) {
      if (
        a !== d &&
        (a.stopPropagation(),
        (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))
      )
        return !1;
      this.leave("animating"), this.trigger("translated");
    }),
    (e.prototype.viewport = function () {
      var d;
      return (
        this.options.responsiveBaseElement !== b
          ? (d = a(this.options.responsiveBaseElement).width())
          : b.innerWidth
          ? (d = b.innerWidth)
          : c.documentElement && c.documentElement.clientWidth
          ? (d = c.documentElement.clientWidth)
          : console.warn("Can not detect viewport width."),
        d
      );
    }),
    (e.prototype.replace = function (b) {
      this.$stage.empty(),
        (this._items = []),
        b && (b = b instanceof jQuery ? b : a(b)),
        this.settings.nestedItemSelector &&
          (b = b.find("." + this.settings.nestedItemSelector)),
        b
          .filter(function () {
            return 1 === this.nodeType;
          })
          .each(
            a.proxy(function (a, b) {
              (b = this.prepare(b)),
                this.$stage.append(b),
                this._items.push(b),
                this._mergers.push(
                  1 *
                    b
                      .find("[data-merge]")
                      .addBack("[data-merge]")
                      .attr("data-merge") || 1
                );
            }, this)
          ),
        this.reset(
          this.isNumeric(this.settings.startPosition)
            ? this.settings.startPosition
            : 0
        ),
        this.invalidate("items");
    }),
    (e.prototype.add = function (b, c) {
      var e = this.relative(this._current);
      (c = c === d ? this._items.length : this.normalize(c, !0)),
        (b = b instanceof jQuery ? b : a(b)),
        this.trigger("add", { content: b, position: c }),
        (b = this.prepare(b)),
        0 === this._items.length || c === this._items.length
          ? (0 === this._items.length && this.$stage.append(b),
            0 !== this._items.length && this._items[c - 1].after(b),
            this._items.push(b),
            this._mergers.push(
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            ))
          : (this._items[c].before(b),
            this._items.splice(c, 0, b),
            this._mergers.splice(
              c,
              0,
              1 *
                b
                  .find("[data-merge]")
                  .addBack("[data-merge]")
                  .attr("data-merge") || 1
            )),
        this._items[e] && this.reset(this._items[e].index()),
        this.invalidate("items"),
        this.trigger("added", { content: b, position: c });
    }),
    (e.prototype.remove = function (a) {
      (a = this.normalize(a, !0)) !== d &&
        (this.trigger("remove", { content: this._items[a], position: a }),
        this._items[a].remove(),
        this._items.splice(a, 1),
        this._mergers.splice(a, 1),
        this.invalidate("items"),
        this.trigger("removed", { content: null, position: a }));
    }),
    (e.prototype.preloadAutoWidthImages = function (b) {
      b.each(
        a.proxy(function (b, c) {
          this.enter("pre-loading"),
            (c = a(c)),
            a(new Image())
              .one(
                "load",
                a.proxy(function (a) {
                  c.attr("src", a.target.src),
                    c.css("opacity", 1),
                    this.leave("pre-loading"),
                    !this.is("pre-loading") &&
                      !this.is("initializing") &&
                      this.refresh();
                }, this)
              )
              .attr(
                "src",
                c.attr("src") || c.attr("data-src") || c.attr("data-src-retina")
              );
        }, this)
      );
    }),
    (e.prototype.destroy = function () {
      this.$element.off(".owl.core"),
        this.$stage.off(".owl.core"),
        a(c).off(".owl.core"),
        !1 !== this.settings.responsive &&
          (b.clearTimeout(this.resizeTimer),
          this.off(b, "resize", this._handlers.onThrottledResize));
      for (var d in this._plugins) this._plugins[d].destroy();
      this.$stage.children(".cloned").remove(),
        this.$stage.unwrap(),
        this.$stage.children().contents().unwrap(),
        this.$stage.children().unwrap(),
        this.$stage.remove(),
        this.$element
          .removeClass(this.options.refreshClass)
          .removeClass(this.options.loadingClass)
          .removeClass(this.options.loadedClass)
          .removeClass(this.options.rtlClass)
          .removeClass(this.options.dragClass)
          .removeClass(this.options.grabClass)
          .attr(
            "class",
            this.$element
              .attr("class")
              .replace(
                new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"),
                ""
              )
          )
          .removeData("owl.carousel");
    }),
    (e.prototype.op = function (a, b, c) {
      var d = this.settings.rtl;
      switch (b) {
        case "<":
          return d ? a > c : a < c;
        case ">":
          return d ? a < c : a > c;
        case ">=":
          return d ? a <= c : a >= c;
        case "<=":
          return d ? a >= c : a <= c;
      }
    }),
    (e.prototype.on = function (a, b, c, d) {
      a.addEventListener
        ? a.addEventListener(b, c, d)
        : a.attachEvent && a.attachEvent("on" + b, c);
    }),
    (e.prototype.off = function (a, b, c, d) {
      a.removeEventListener
        ? a.removeEventListener(b, c, d)
        : a.detachEvent && a.detachEvent("on" + b, c);
    }),
    (e.prototype.trigger = function (b, c, d, f, g) {
      var h = { item: { count: this._items.length, index: this.current() } },
        i = a.camelCase(
          a
            .grep(["on", b, d], function (a) {
              return a;
            })
            .join("-")
            .toLowerCase()
        ),
        j = a.Event(
          [b, "owl", d || "carousel"].join(".").toLowerCase(),
          a.extend({ relatedTarget: this }, h, c)
        );
      return (
        this._supress[b] ||
          (a.each(this._plugins, function (a, b) {
            b.onTrigger && b.onTrigger(j);
          }),
          this.register({ type: e.Type.Event, name: b }),
          this.$element.trigger(j),
          this.settings &&
            "function" == typeof this.settings[i] &&
            this.settings[i].call(this, j)),
        j
      );
    }),
    (e.prototype.enter = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b] === d && (this._states.current[b] = 0),
            this._states.current[b]++;
        }, this)
      );
    }),
    (e.prototype.leave = function (b) {
      a.each(
        [b].concat(this._states.tags[b] || []),
        a.proxy(function (a, b) {
          this._states.current[b]--;
        }, this)
      );
    }),
    (e.prototype.register = function (b) {
      if (b.type === e.Type.Event) {
        if (
          (a.event.special[b.name] || (a.event.special[b.name] = {}),
          !a.event.special[b.name].owl)
        ) {
          var c = a.event.special[b.name]._default;
          (a.event.special[b.name]._default = function (a) {
            return !c ||
              !c.apply ||
              (a.namespace && -1 !== a.namespace.indexOf("owl"))
              ? a.namespace && a.namespace.indexOf("owl") > -1
              : c.apply(this, arguments);
          }),
            (a.event.special[b.name].owl = !0);
        }
      } else
        b.type === e.Type.State &&
          (this._states.tags[b.name]
            ? (this._states.tags[b.name] = this._states.tags[b.name].concat(
                b.tags
              ))
            : (this._states.tags[b.name] = b.tags),
          (this._states.tags[b.name] = a.grep(
            this._states.tags[b.name],
            a.proxy(function (c, d) {
              return a.inArray(c, this._states.tags[b.name]) === d;
            }, this)
          )));
    }),
    (e.prototype.suppress = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          this._supress[b] = !0;
        }, this)
      );
    }),
    (e.prototype.release = function (b) {
      a.each(
        b,
        a.proxy(function (a, b) {
          delete this._supress[b];
        }, this)
      );
    }),
    (e.prototype.pointer = function (a) {
      var c = { x: null, y: null };
      return (
        (a = a.originalEvent || a || b.event),
        (a =
          a.touches && a.touches.length
            ? a.touches[0]
            : a.changedTouches && a.changedTouches.length
            ? a.changedTouches[0]
            : a),
        a.pageX
          ? ((c.x = a.pageX), (c.y = a.pageY))
          : ((c.x = a.clientX), (c.y = a.clientY)),
        c
      );
    }),
    (e.prototype.isNumeric = function (a) {
      return !isNaN(parseFloat(a));
    }),
    (e.prototype.difference = function (a, b) {
      return { x: a.x - b.x, y: a.y - b.y };
    }),
    (a.fn.owlCarousel = function (b) {
      var c = Array.prototype.slice.call(arguments, 1);
      return this.each(function () {
        var d = a(this),
          f = d.data("owl.carousel");
        f ||
          ((f = new e(this, "object" == typeof b && b)),
          d.data("owl.carousel", f),
          a.each(
            [
              "next",
              "prev",
              "to",
              "destroy",
              "refresh",
              "replace",
              "add",
              "remove",
            ],
            function (b, c) {
              f.register({ type: e.Type.Event, name: c }),
                f.$element.on(
                  c + ".owl.carousel.core",
                  a.proxy(function (a) {
                    a.namespace &&
                      a.relatedTarget !== this &&
                      (this.suppress([c]),
                      f[c].apply(this, [].slice.call(arguments, 1)),
                      this.release([c]));
                  }, f)
                );
            }
          )),
          "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c);
      });
    }),
    (a.fn.owlCarousel.Constructor = e);
})(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._interval = null),
        (this._visible = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoRefresh && this.watch();
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
      (e.prototype.watch = function () {
        this._interval ||
          ((this._visible = this._core.isVisible()),
          (this._interval = b.setInterval(
            a.proxy(this.refresh, this),
            this._core.settings.autoRefreshInterval
          )));
      }),
      (e.prototype.refresh = function () {
        this._core.isVisible() !== this._visible &&
          ((this._visible = !this._visible),
          this._core.$element.toggleClass("owl-hidden", !this._visible),
          this._visible &&
            this._core.invalidate("width") &&
            this._core.refresh());
      }),
      (e.prototype.destroy = function () {
        var a, c;
        b.clearInterval(this._interval);
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._loaded = []),
        (this._handlers = {
          "initialized.owl.carousel change.owl.carousel resized.owl.carousel":
            a.proxy(function (b) {
              if (
                b.namespace &&
                this._core.settings &&
                this._core.settings.lazyLoad &&
                ((b.property && "position" == b.property.name) ||
                  "initialized" == b.type)
              ) {
                var c = this._core.settings,
                  e = (c.center && Math.ceil(c.items / 2)) || c.items,
                  f = (c.center && -1 * e) || 0,
                  g =
                    (b.property && b.property.value !== d
                      ? b.property.value
                      : this._core.current()) + f,
                  h = this._core.clones().length,
                  i = a.proxy(function (a, b) {
                    this.load(b);
                  }, this);
                for (
                  c.lazyLoadEager > 0 &&
                  ((e += c.lazyLoadEager),
                  c.loop && ((g -= c.lazyLoadEager), e++));
                  f++ < e;

                )
                  this.load(h / 2 + this._core.relative(g)),
                    h && a.each(this._core.clones(this._core.relative(g)), i),
                    g++;
              }
            }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers);
    };
    (e.Defaults = { lazyLoad: !1, lazyLoadEager: 0 }),
      (e.prototype.load = function (c) {
        var d = this._core.$stage.children().eq(c),
          e = d && d.find(".owl-lazy");
        !e ||
          a.inArray(d.get(0), this._loaded) > -1 ||
          (e.each(
            a.proxy(function (c, d) {
              var e,
                f = a(d),
                g =
                  (b.devicePixelRatio > 1 && f.attr("data-src-retina")) ||
                  f.attr("data-src") ||
                  f.attr("data-srcset");
              this._core.trigger("load", { element: f, url: g }, "lazy"),
                f.is("img")
                  ? f
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          f.css("opacity", 1),
                            this._core.trigger(
                              "loaded",
                              { element: f, url: g },
                              "lazy"
                            );
                        }, this)
                      )
                      .attr("src", g)
                  : f.is("source")
                  ? f
                      .one(
                        "load.owl.lazy",
                        a.proxy(function () {
                          this._core.trigger(
                            "loaded",
                            { element: f, url: g },
                            "lazy"
                          );
                        }, this)
                      )
                      .attr("srcset", g)
                  : ((e = new Image()),
                    (e.onload = a.proxy(function () {
                      f.css({
                        "background-image": 'url("' + g + '")',
                        opacity: "1",
                      }),
                        this._core.trigger(
                          "loaded",
                          { element: f, url: g },
                          "lazy"
                        );
                    }, this)),
                    (e.src = g));
            }, this)
          ),
          this._loaded.push(d.get(0)));
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Lazy = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (c) {
      (this._core = c),
        (this._previousHeight = null),
        (this._handlers = {
          "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (
            a
          ) {
            a.namespace && this._core.settings.autoHeight && this.update();
          },
          this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              "position" === a.property.name &&
              this.update();
          }, this),
          "loaded.owl.lazy": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.autoHeight &&
              a.element.closest("." + this._core.settings.itemClass).index() ===
                this._core.current() &&
              this.update();
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        (this._intervalId = null);
      var d = this;
      a(b).on("load", function () {
        d._core.settings.autoHeight && d.update();
      }),
        a(b).resize(function () {
          d._core.settings.autoHeight &&
            (null != d._intervalId && clearTimeout(d._intervalId),
            (d._intervalId = setTimeout(function () {
              d.update();
            }, 250)));
        });
    };
    (e.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
      (e.prototype.update = function () {
        var b = this._core._current,
          c = b + this._core.settings.items,
          d = this._core.settings.lazyLoad,
          e = this._core.$stage.children().toArray().slice(b, c),
          f = [],
          g = 0;
        a.each(e, function (b, c) {
          f.push(a(c).height());
        }),
          (g = Math.max.apply(null, f)),
          g <= 1 && d && this._previousHeight && (g = this._previousHeight),
          (this._previousHeight = g),
          this._core.$stage
            .parent()
            .height(g)
            .addClass(this._core.settings.autoHeightClass);
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._videos = {}),
        (this._playing = null),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.register({
                type: "state",
                name: "playing",
                tags: ["interacting"],
              });
          }, this),
          "resize.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.video &&
              this.isInFullScreen() &&
              a.preventDefault();
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.is("resizing") &&
              this._core.$stage.find(".cloned .owl-video-frame").remove();
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" === a.property.name &&
              this._playing &&
              this.stop();
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content).find(".owl-video");
              c.length &&
                (c.css("display", "none"), this.fetch(c, a(b.content)));
            }
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this._core.$element.on(this._handlers),
        this._core.$element.on(
          "click.owl.video",
          ".owl-video-play-icon",
          a.proxy(function (a) {
            this.play(a);
          }, this)
        );
    };
    (e.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
      (e.prototype.fetch = function (a, b) {
        var c = (function () {
            return a.attr("data-vimeo-id")
              ? "vimeo"
              : a.attr("data-vzaar-id")
              ? "vzaar"
              : "youtube";
          })(),
          d =
            a.attr("data-vimeo-id") ||
            a.attr("data-youtube-id") ||
            a.attr("data-vzaar-id"),
          e = a.attr("data-width") || this._core.settings.videoWidth,
          f = a.attr("data-height") || this._core.settings.videoHeight,
          g = a.attr("href");
        if (!g) throw new Error("Missing video URL.");
        if (
          ((d = g.match(
            /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
          )),
          d[3].indexOf("youtu") > -1)
        )
          c = "youtube";
        else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
        else {
          if (!(d[3].indexOf("vzaar") > -1))
            throw new Error("Video URL not supported.");
          c = "vzaar";
        }
        (d = d[6]),
          (this._videos[g] = { type: c, id: d, width: e, height: f }),
          b.attr("data-video", g),
          this.thumbnail(a, this._videos[g]);
      }),
      (e.prototype.thumbnail = function (b, c) {
        var d,
          e,
          f,
          g =
            c.width && c.height
              ? "width:" + c.width + "px;height:" + c.height + "px;"
              : "",
          h = b.find("img"),
          i = "src",
          j = "",
          k = this._core.settings,
          l = function (c) {
            (e = '<div class="owl-video-play-icon"></div>'),
              (d = k.lazyLoad
                ? a("<div/>", { class: "owl-video-tn " + j, srcType: c })
                : a("<div/>", {
                    class: "owl-video-tn",
                    style: "opacity:1;background-image:url(" + c + ")",
                  })),
              b.after(d),
              b.after(e);
          };
        if (
          (b.wrap(a("<div/>", { class: "owl-video-wrapper", style: g })),
          this._core.settings.lazyLoad && ((i = "data-src"), (j = "owl-lazy")),
          h.length)
        )
          return l(h.attr(i)), h.remove(), !1;
        "youtube" === c.type
          ? ((f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg"), l(f))
          : "vimeo" === c.type
          ? a.ajax({
              type: "GET",
              url: "//vimeo.com/api/v2/video/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a[0].thumbnail_large), l(f);
              },
            })
          : "vzaar" === c.type &&
            a.ajax({
              type: "GET",
              url: "//vzaar.com/api/videos/" + c.id + ".json",
              jsonp: "callback",
              dataType: "jsonp",
              success: function (a) {
                (f = a.framegrab_url), l(f);
              },
            });
      }),
      (e.prototype.stop = function () {
        this._core.trigger("stop", null, "video"),
          this._playing.find(".owl-video-frame").remove(),
          this._playing.removeClass("owl-video-playing"),
          (this._playing = null),
          this._core.leave("playing"),
          this._core.trigger("stopped", null, "video");
      }),
      (e.prototype.play = function (b) {
        var c,
          d = a(b.target),
          e = d.closest("." + this._core.settings.itemClass),
          f = this._videos[e.attr("data-video")],
          g = f.width || "100%",
          h = f.height || this._core.$stage.height();
        this._playing ||
          (this._core.enter("playing"),
          this._core.trigger("play", null, "video"),
          (e = this._core.items(this._core.relative(e.index()))),
          this._core.reset(e.index()),
          (c = a(
            '<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'
          )),
          c.attr("height", h),
          c.attr("width", g),
          "youtube" === f.type
            ? c.attr(
                "src",
                "//www.youtube.com/embed/" +
                  f.id +
                  "?autoplay=1&rel=0&v=" +
                  f.id
              )
            : "vimeo" === f.type
            ? c.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1")
            : "vzaar" === f.type &&
              c.attr(
                "src",
                "//view.vzaar.com/" + f.id + "/player?autoplay=true"
              ),
          a(c)
            .wrap('<div class="owl-video-frame" />')
            .insertAfter(e.find(".owl-video")),
          (this._playing = e.addClass("owl-video-playing")));
      }),
      (e.prototype.isInFullScreen = function () {
        var b =
          c.fullscreenElement ||
          c.mozFullScreenElement ||
          c.webkitFullscreenElement;
        return b && a(b).parent().hasClass("owl-video-frame");
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Video = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this.core = b),
        (this.core.options = a.extend({}, e.Defaults, this.core.options)),
        (this.swapping = !0),
        (this.previous = d),
        (this.next = d),
        (this.handlers = {
          "change.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              "position" == a.property.name &&
              ((this.previous = this.core.current()),
              (this.next = a.property.value));
          }, this),
          "drag.owl.carousel dragged.owl.carousel translated.owl.carousel":
            a.proxy(function (a) {
              a.namespace && (this.swapping = "translated" == a.type);
            }, this),
          "translate.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this.swapping &&
              (this.core.options.animateOut || this.core.options.animateIn) &&
              this.swap();
          }, this),
        }),
        this.core.$element.on(this.handlers);
    };
    (e.Defaults = { animateOut: !1, animateIn: !1 }),
      (e.prototype.swap = function () {
        if (
          1 === this.core.settings.items &&
          a.support.animation &&
          a.support.transition
        ) {
          this.core.speed(0);
          var b,
            c = a.proxy(this.clear, this),
            d = this.core.$stage.children().eq(this.previous),
            e = this.core.$stage.children().eq(this.next),
            f = this.core.settings.animateIn,
            g = this.core.settings.animateOut;
          this.core.current() !== this.previous &&
            (g &&
              ((b =
                this.core.coordinates(this.previous) -
                this.core.coordinates(this.next)),
              d
                .one(a.support.animation.end, c)
                .css({ left: b + "px" })
                .addClass("animated owl-animated-out")
                .addClass(g)),
            f &&
              e
                .one(a.support.animation.end, c)
                .addClass("animated owl-animated-in")
                .addClass(f));
        }
      }),
      (e.prototype.clear = function (b) {
        a(b.target)
          .css({ left: "" })
          .removeClass("animated owl-animated-out owl-animated-in")
          .removeClass(this.core.settings.animateIn)
          .removeClass(this.core.settings.animateOut),
          this.core.onTransitionEnd();
      }),
      (e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Animate = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    var e = function (b) {
      (this._core = b),
        (this._call = null),
        (this._time = 0),
        (this._timeout = 0),
        (this._paused = !0),
        (this._handlers = {
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "settings" === a.property.name
              ? this._core.settings.autoplay
                ? this.play()
                : this.stop()
              : a.namespace &&
                "position" === a.property.name &&
                this._paused &&
                (this._time = 0);
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace && this._core.settings.autoplay && this.play();
          }, this),
          "play.owl.autoplay": a.proxy(function (a, b, c) {
            a.namespace && this.play(b, c);
          }, this),
          "stop.owl.autoplay": a.proxy(function (a) {
            a.namespace && this.stop();
          }, this),
          "mouseover.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "mouseleave.owl.autoplay": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.play();
          }, this),
          "touchstart.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause &&
              this._core.is("rotating") &&
              this.pause();
          }, this),
          "touchend.owl.core": a.proxy(function () {
            this._core.settings.autoplayHoverPause && this.play();
          }, this),
        }),
        this._core.$element.on(this._handlers),
        (this._core.options = a.extend({}, e.Defaults, this._core.options));
    };
    (e.Defaults = {
      autoplay: !1,
      autoplayTimeout: 5e3,
      autoplayHoverPause: !1,
      autoplaySpeed: !1,
    }),
      (e.prototype._next = function (d) {
        (this._call = b.setTimeout(
          a.proxy(this._next, this, d),
          this._timeout * (Math.round(this.read() / this._timeout) + 1) -
            this.read()
        )),
          this._core.is("interacting") ||
            c.hidden ||
            this._core.next(d || this._core.settings.autoplaySpeed);
      }),
      (e.prototype.read = function () {
        return new Date().getTime() - this._time;
      }),
      (e.prototype.play = function (c, d) {
        var e;
        this._core.is("rotating") || this._core.enter("rotating"),
          (c = c || this._core.settings.autoplayTimeout),
          (e = Math.min(this._time % (this._timeout || c), c)),
          this._paused
            ? ((this._time = this.read()), (this._paused = !1))
            : b.clearTimeout(this._call),
          (this._time += (this.read() % c) - e),
          (this._timeout = c),
          (this._call = b.setTimeout(a.proxy(this._next, this, d), c - e));
      }),
      (e.prototype.stop = function () {
        this._core.is("rotating") &&
          ((this._time = 0),
          (this._paused = !0),
          b.clearTimeout(this._call),
          this._core.leave("rotating"));
      }),
      (e.prototype.pause = function () {
        this._core.is("rotating") &&
          !this._paused &&
          ((this._time = this.read()),
          (this._paused = !0),
          b.clearTimeout(this._call));
      }),
      (e.prototype.destroy = function () {
        var a, b;
        this.stop();
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this))
          "function" != typeof this[b] && (this[b] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.autoplay = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (b) {
      (this._core = b),
        (this._initialized = !1),
        (this._pages = []),
        (this._controls = {}),
        (this._templates = []),
        (this.$element = this._core.$element),
        (this._overrides = {
          next: this._core.next,
          prev: this._core.prev,
          to: this._core.to,
        }),
        (this._handlers = {
          "prepared.owl.carousel": a.proxy(function (b) {
            b.namespace &&
              this._core.settings.dotsData &&
              this._templates.push(
                '<div class="' +
                  this._core.settings.dotClass +
                  '">' +
                  a(b.content)
                    .find("[data-dot]")
                    .addBack("[data-dot]")
                    .attr("data-dot") +
                  "</div>"
              );
          }, this),
          "added.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 0, this._templates.pop());
          }, this),
          "remove.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._core.settings.dotsData &&
              this._templates.splice(a.position, 1);
          }, this),
          "changed.owl.carousel": a.proxy(function (a) {
            a.namespace && "position" == a.property.name && this.draw();
          }, this),
          "initialized.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              !this._initialized &&
              (this._core.trigger("initialize", null, "navigation"),
              this.initialize(),
              this.update(),
              this.draw(),
              (this._initialized = !0),
              this._core.trigger("initialized", null, "navigation"));
          }, this),
          "refreshed.owl.carousel": a.proxy(function (a) {
            a.namespace &&
              this._initialized &&
              (this._core.trigger("refresh", null, "navigation"),
              this.update(),
              this.draw(),
              this._core.trigger("refreshed", null, "navigation"));
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers);
    };
    (e.Defaults = {
      nav: !1,
      navText: [
        '<span aria-label="Previous">&#x2039;</span>',
        '<span aria-label="Next">&#x203a;</span>',
      ],
      navSpeed: !1,
      navElement: 'button type="button" role="presentation"',
      navContainer: !1,
      navContainerClass: "owl-nav",
      navClass: ["owl-prev", "owl-next"],
      slideBy: 1,
      dotClass: "owl-dot",
      dotsClass: "owl-dots",
      dots: !0,
      dotsEach: !1,
      dotsData: !1,
      dotsSpeed: !1,
      dotsContainer: !1,
    }),
      (e.prototype.initialize = function () {
        var b,
          c = this._core.settings;
        (this._controls.$relative = (
          c.navContainer
            ? a(c.navContainer)
            : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)
        ).addClass("disabled")),
          (this._controls.$previous = a("<" + c.navElement + ">")
            .addClass(c.navClass[0])
            .html(c.navText[0])
            .prependTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.prev(c.navSpeed);
              }, this)
            )),
          (this._controls.$next = a("<" + c.navElement + ">")
            .addClass(c.navClass[1])
            .html(c.navText[1])
            .appendTo(this._controls.$relative)
            .on(
              "click",
              a.proxy(function (a) {
                this.next(c.navSpeed);
              }, this)
            )),
          c.dotsData ||
            (this._templates = [
              a('<button role="button">')
                .addClass(c.dotClass)
                .append(a("<span>"))
                .prop("outerHTML"),
            ]),
          (this._controls.$absolute = (
            c.dotsContainer
              ? a(c.dotsContainer)
              : a("<div>").addClass(c.dotsClass).appendTo(this.$element)
          ).addClass("disabled")),
          this._controls.$absolute.on(
            "click",
            "button",
            a.proxy(function (b) {
              var d = a(b.target).parent().is(this._controls.$absolute)
                ? a(b.target).index()
                : a(b.target).parent().index();
              b.preventDefault(), this.to(d, c.dotsSpeed);
            }, this)
          );
        for (b in this._overrides) this._core[b] = a.proxy(this[b], this);
      }),
      (e.prototype.destroy = function () {
        var a, b, c, d, e;
        e = this._core.settings;
        for (a in this._handlers) this.$element.off(a, this._handlers[a]);
        for (b in this._controls)
          "$relative" === b && e.navContainer
            ? this._controls[b].html("")
            : this._controls[b].remove();
        for (d in this.overides) this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this))
          "function" != typeof this[c] && (this[c] = null);
      }),
      (e.prototype.update = function () {
        var a,
          b,
          c,
          d = this._core.clones().length / 2,
          e = d + this._core.items().length,
          f = this._core.maximum(!0),
          g = this._core.settings,
          h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
        if (
          ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)),
          g.dots || "page" == g.slideBy)
        )
          for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
            if (b >= h || 0 === b) {
              if (
                (this._pages.push({
                  start: Math.min(f, a - d),
                  end: a - d + h - 1,
                }),
                Math.min(f, a - d) === f)
              )
                break;
              (b = 0), ++c;
            }
            b += this._core.mergers(this._core.relative(a));
          }
      }),
      (e.prototype.draw = function () {
        var b,
          c = this._core.settings,
          d = this._core.items().length <= c.items,
          e = this._core.relative(this._core.current()),
          f = c.loop || c.rewind;
        this._controls.$relative.toggleClass("disabled", !c.nav || d),
          c.nav &&
            (this._controls.$previous.toggleClass(
              "disabled",
              !f && e <= this._core.minimum(!0)
            ),
            this._controls.$next.toggleClass(
              "disabled",
              !f && e >= this._core.maximum(!0)
            )),
          this._controls.$absolute.toggleClass("disabled", !c.dots || d),
          c.dots &&
            ((b =
              this._pages.length - this._controls.$absolute.children().length),
            c.dotsData && 0 !== b
              ? this._controls.$absolute.html(this._templates.join(""))
              : b > 0
              ? this._controls.$absolute.append(
                  new Array(b + 1).join(this._templates[0])
                )
              : b < 0 && this._controls.$absolute.children().slice(b).remove(),
            this._controls.$absolute.find(".active").removeClass("active"),
            this._controls.$absolute
              .children()
              .eq(a.inArray(this.current(), this._pages))
              .addClass("active"));
      }),
      (e.prototype.onTrigger = function (b) {
        var c = this._core.settings;
        b.page = {
          index: a.inArray(this.current(), this._pages),
          count: this._pages.length,
          size:
            c &&
            (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items),
        };
      }),
      (e.prototype.current = function () {
        var b = this._core.relative(this._core.current());
        return a
          .grep(
            this._pages,
            a.proxy(function (a, c) {
              return a.start <= b && a.end >= b;
            }, this)
          )
          .pop();
      }),
      (e.prototype.getPosition = function (b) {
        var c,
          d,
          e = this._core.settings;
        return (
          "page" == e.slideBy
            ? ((c = a.inArray(this.current(), this._pages)),
              (d = this._pages.length),
              b ? ++c : --c,
              (c = this._pages[((c % d) + d) % d].start))
            : ((c = this._core.relative(this._core.current())),
              (d = this._core.items().length),
              b ? (c += e.slideBy) : (c -= e.slideBy)),
          c
        );
      }),
      (e.prototype.next = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b);
      }),
      (e.prototype.prev = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b);
      }),
      (e.prototype.to = function (b, c, d) {
        var e;
        !d && this._pages.length
          ? ((e = this._pages.length),
            a.proxy(this._overrides.to, this._core)(
              this._pages[((b % e) + e) % e].start,
              c
            ))
          : a.proxy(this._overrides.to, this._core)(b, c);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Navigation = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    "use strict";
    var e = function (c) {
      (this._core = c),
        (this._hashes = {}),
        (this.$element = this._core.$element),
        (this._handlers = {
          "initialized.owl.carousel": a.proxy(function (c) {
            c.namespace &&
              "URLHash" === this._core.settings.startPosition &&
              a(b).trigger("hashchange.owl.navigation");
          }, this),
          "prepared.owl.carousel": a.proxy(function (b) {
            if (b.namespace) {
              var c = a(b.content)
                .find("[data-hash]")
                .addBack("[data-hash]")
                .attr("data-hash");
              if (!c) return;
              this._hashes[c] = b.content;
            }
          }, this),
          "changed.owl.carousel": a.proxy(function (c) {
            if (c.namespace && "position" === c.property.name) {
              var d = this._core.items(
                  this._core.relative(this._core.current())
                ),
                e = a
                  .map(this._hashes, function (a, b) {
                    return a === d ? b : null;
                  })
                  .join();
              if (!e || b.location.hash.slice(1) === e) return;
              b.location.hash = e;
            }
          }, this),
        }),
        (this._core.options = a.extend({}, e.Defaults, this._core.options)),
        this.$element.on(this._handlers),
        a(b).on(
          "hashchange.owl.navigation",
          a.proxy(function (a) {
            var c = b.location.hash.substring(1),
              e = this._core.$stage.children(),
              f = this._hashes[c] && e.index(this._hashes[c]);
            f !== d &&
              f !== this._core.current() &&
              this._core.to(this._core.relative(f), !1, !0);
          }, this)
        );
    };
    (e.Defaults = { URLhashListener: !1 }),
      (e.prototype.destroy = function () {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this))
          "function" != typeof this[d] && (this[d] = null);
      }),
      (a.fn.owlCarousel.Constructor.Plugins.Hash = e);
  })(window.Zepto || window.jQuery, window, document),
  (function (a, b, c, d) {
    function e(b, c) {
      var e = !1,
        f = b.charAt(0).toUpperCase() + b.slice(1);
      return (
        a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
          if (g[b] !== d) return (e = !c || b), !1;
        }),
        e
      );
    }
    function f(a) {
      return e(a, !0);
    }
    var g = a("<support>").get(0).style,
      h = "Webkit Moz O ms".split(" "),
      i = {
        transition: {
          end: {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            transition: "transitionend",
          },
        },
        animation: {
          end: {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            OAnimation: "oAnimationEnd",
            animation: "animationend",
          },
        },
      },
      j = {
        csstransforms: function () {
          return !!e("transform");
        },
        csstransforms3d: function () {
          return !!e("perspective");
        },
        csstransitions: function () {
          return !!e("transition");
        },
        cssanimations: function () {
          return !!e("animation");
        },
      };
    j.csstransitions() &&
      ((a.support.transition = new String(f("transition"))),
      (a.support.transition.end = i.transition.end[a.support.transition])),
      j.cssanimations() &&
        ((a.support.animation = new String(f("animation"))),
        (a.support.animation.end = i.animation.end[a.support.animation])),
      j.csstransforms() &&
        ((a.support.transform = new String(f("transform"))),
        (a.support.transform3d = j.csstransforms3d()));
  })(window.Zepto || window.jQuery, window, document);

/* ========================================================== */

/*! owl.carousel2.thumbs - v0.1.8 | (c) 2016 @gijsroge | MIT license | https://github.com/gijsroge/OwlCarousel2-Thumbs */
!(function (a, b, c, d) {
  "use strict";
  var e = function (b) {
    (this.owl = b),
      (this._thumbcontent = []),
      (this._identifier = 0),
      (this.owl_currentitem = this.owl.options.startPosition),
      (this.$element = this.owl.$element),
      (this._handlers = {
        "prepared.owl.carousel": a.proxy(function (b) {
          if (
            !b.namespace ||
            !this.owl.options.thumbs ||
            this.owl.options.thumbImage ||
            this.owl.options.thumbsPrerendered ||
            this.owl.options.thumbImage
          ) {
            if (
              b.namespace &&
              this.owl.options.thumbs &&
              this.owl.options.thumbImage
            ) {
              var c = a(b.content).find("img");
              this._thumbcontent.push(c);
            }
          } else a(b.content).find("[data-thumb]").attr("data-thumb") !== d && this._thumbcontent.push(a(b.content).find("[data-thumb]").attr("data-thumb"));
        }, this),
        "initialized.owl.carousel": a.proxy(function (a) {
          a.namespace &&
            this.owl.options.thumbs &&
            (this.render(),
            this.listen(),
            (this._identifier = this.owl.$element.data("slider-id")),
            this.setActive());
        }, this),
        "changed.owl.carousel": a.proxy(function (a) {
          a.namespace &&
            "position" === a.property.name &&
            this.owl.options.thumbs &&
            ((this._identifier = this.owl.$element.data("slider-id")),
            this.setActive());
        }, this),
      }),
      (this.owl.options = a.extend({}, e.Defaults, this.owl.options)),
      this.owl.$element.on(this._handlers);
  };
  (e.Defaults = {
    thumbs: !0,
    thumbImage: !1,
    thumbContainerClass: "owl-thumbs",
    thumbItemClass: "owl-thumb-item",
    moveThumbsInside: !1,
  }),
    (e.prototype.listen = function () {
      var b = this.owl.options;
      b.thumbsPrerendered &&
        (this._thumbcontent._thumbcontainer = a("." + b.thumbContainerClass)),
        a(this._thumbcontent._thumbcontainer).on(
          "click",
          this._thumbcontent._thumbcontainer.children(),
          a.proxy(function (c) {
            this._identifier = a(c.target)
              .closest("." + b.thumbContainerClass)
              .data("slider-id");
            var d = a(c.target).parent().is(this._thumbcontent._thumbcontainer)
              ? a(c.target).index()
              : a(c.target)
                  .closest("." + b.thumbItemClass)
                  .index();
            b.thumbsPrerendered
              ? a("[data-slider-id=" + this._identifier + "]").trigger(
                  "to.owl.carousel",
                  [d, b.dotsSpeed, !0]
                )
              : this.owl.to(d, b.dotsSpeed),
              c.preventDefault();
          }, this)
        );
    }),
    (e.prototype.render = function () {
      var b = this.owl.options;
      b.thumbsPrerendered
        ? ((this._thumbcontent._thumbcontainer = a(
            "." + b.thumbContainerClass
          )),
          b.moveThumbsInside &&
            this._thumbcontent._thumbcontainer.appendTo(this.$element))
        : (this._thumbcontent._thumbcontainer = a("<div>")
            .addClass(b.thumbContainerClass)
            .appendTo(this.$element));
      var c;
      if (b.thumbImage)
        for (c = 0; c < this._thumbcontent.length; ++c)
          this._thumbcontent._thumbcontainer.append(
            "<button class=" +
              b.thumbItemClass +
              '><img src="' +
              this._thumbcontent[c].attr("src") +
              '" alt="' +
              this._thumbcontent[c].attr("alt") +
              '" /></button>'
          );
      else
        for (c = 0; c < this._thumbcontent.length; ++c)
          this._thumbcontent._thumbcontainer.append(
            "<button class=" +
              b.thumbItemClass +
              ">" +
              this._thumbcontent[c] +
              "</button>"
          );
    }),
    (e.prototype.setActive = function () {
      (this.owl_currentitem = this.owl._current - this.owl._clones.length / 2),
        this.owl_currentitem === this.owl._items.length &&
          (this.owl_currentitem = 0);
      var b = this.owl.options,
        c = b.thumbsPrerendered
          ? a(
              "." +
                b.thumbContainerClass +
                '[data-slider-id="' +
                this._identifier +
                '"]'
            )
          : this._thumbcontent._thumbcontainer;
      c.children().filter(".active").removeClass("active"),
        c.children().eq(this.owl_currentitem).addClass("active");
    }),
    (e.prototype.destroy = function () {
      var a, b;
      for (a in this._handlers) this.owl.$element.off(a, this._handlers[a]);
      for (b in Object.getOwnPropertyNames(this))
        "function" != typeof this[b] && (this[b] = null);
    }),
    (a.fn.owlCarousel.Constructor.Plugins.Thumbs = e);
})(window.Zepto || window.jQuery, window, document);

/**
 *
 * vanilla-lazyload@13.0.1
 *
 **/
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t = t || self).LazyLoad = e());
})(this, function () {
  "use strict";
  function t() {
    return (t =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
        }
        return t;
      }).apply(this, arguments);
  }
  var e = "undefined" != typeof window,
    n =
      (e && !("onscroll" in window)) ||
      ("undefined" != typeof navigator &&
        /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)),
    r = e && "IntersectionObserver" in window,
    a = e && "classList" in document.createElement("p"),
    o = {
      elements_selector: "img",
      container: n || e ? document : null,
      threshold: 300,
      thresholds: null,
      data_src: "src",
      data_srcset: "srcset",
      data_sizes: "sizes",
      data_bg: "bg",
      data_poster: "poster",
      class_loading: "loading",
      class_loaded: "loaded",
      class_error: "error",
      load_delay: 0,
      auto_unobserve: !0,
      callback_enter: null,
      callback_exit: null,
      callback_reveal: null,
      callback_loaded: null,
      callback_error: null,
      callback_finish: null,
      use_native: !1,
    },
    i = function (t, e) {
      var n,
        r = new t(e);
      try {
        n = new CustomEvent("LazyLoad::Initialized", {
          detail: { instance: r },
        });
      } catch (t) {
        (n = document.createEvent("CustomEvent")).initCustomEvent(
          "LazyLoad::Initialized",
          !1,
          !1,
          { instance: r }
        );
      }
      window.dispatchEvent(n);
    },
    s = function (t, e) {
      return t.getAttribute("data-" + e);
    },
    c = function (t, e, n) {
      var r = "data-" + e;
      null !== n ? t.setAttribute(r, n) : t.removeAttribute(r);
    },
    l = function (t) {
      return "true" === s(t, "was-processed");
    },
    u = function (t, e) {
      return c(t, "ll-timeout", e);
    },
    d = function (t) {
      return s(t, "ll-timeout");
    },
    f = function (t) {
      for (var e, n = [], r = 0; (e = t.children[r]); r += 1)
        "SOURCE" === e.tagName && n.push(e);
      return n;
    },
    _ = function (t, e, n) {
      n && t.setAttribute(e, n);
    },
    v = function (t, e) {
      _(t, "sizes", s(t, e.data_sizes)),
        _(t, "srcset", s(t, e.data_srcset)),
        _(t, "src", s(t, e.data_src));
    },
    g = {
      IMG: function (t, e) {
        var n = t.parentNode;
        n &&
          "PICTURE" === n.tagName &&
          f(n).forEach(function (t) {
            v(t, e);
          });
        v(t, e);
      },
      IFRAME: function (t, e) {
        _(t, "src", s(t, e.data_src));
      },
      VIDEO: function (t, e) {
        f(t).forEach(function (t) {
          _(t, "src", s(t, e.data_src));
        }),
          _(t, "poster", s(t, e.data_poster)),
          _(t, "src", s(t, e.data_src)),
          t.load();
      },
    },
    h = function (t, e) {
      var n,
        r,
        a = e._settings,
        o = t.tagName,
        i = g[o];
      if (i)
        return (
          i(t, a),
          (e.loadingCount += 1),
          void (e._elements =
            ((n = e._elements),
            (r = t),
            n.filter(function (t) {
              return t !== r;
            })))
        );
      !(function (t, e) {
        var n = s(t, e.data_src),
          r = s(t, e.data_bg);
        n && (t.style.backgroundImage = 'url("'.concat(n, '")')),
          r && (t.style.backgroundImage = r);
      })(t, a);
    },
    m = function (t, e) {
      a ? t.classList.add(e) : (t.className += (t.className ? " " : "") + e);
    },
    b = function (t, e) {
      a
        ? t.classList.remove(e)
        : (t.className = t.className
            .replace(new RegExp("(^|\\s+)" + e + "(\\s+|$)"), " ")
            .replace(/^\s+/, "")
            .replace(/\s+$/, ""));
    },
    p = function (t, e, n, r) {
      t && (void 0 === r ? (void 0 === n ? t(e) : t(e, n)) : t(e, n, r));
    },
    y = function (t, e, n) {
      t.addEventListener(e, n);
    },
    E = function (t, e, n) {
      t.removeEventListener(e, n);
    },
    w = function (t, e, n) {
      E(t, "load", e), E(t, "loadeddata", e), E(t, "error", n);
    },
    I = function (t, e, n) {
      var r = n._settings,
        a = e ? r.class_loaded : r.class_error,
        o = e ? r.callback_loaded : r.callback_error,
        i = t.target;
      b(i, r.class_loading),
        m(i, a),
        p(o, i, n),
        (n.loadingCount -= 1),
        0 === n._elements.length &&
          0 === n.loadingCount &&
          p(r.callback_finish, n);
    },
    k = function (t, e) {
      var n = function n(a) {
          I(a, !0, e), w(t, n, r);
        },
        r = function r(a) {
          I(a, !1, e), w(t, n, r);
        };
      !(function (t, e, n) {
        y(t, "load", e), y(t, "loadeddata", e), y(t, "error", n);
      })(t, n, r);
    },
    A = ["IMG", "IFRAME", "VIDEO"],
    L = function (t, e) {
      var n = e._observer;
      z(t, e), n && e._settings.auto_unobserve && n.unobserve(t);
    },
    z = function (t, e, n) {
      var r = e._settings;
      (!n && l(t)) ||
        (A.indexOf(t.tagName) > -1 && (k(t, e), m(t, r.class_loading)),
        h(t, e),
        (function (t) {
          c(t, "was-processed", "true");
        })(t),
        p(r.callback_reveal, t, e));
    },
    O = function (t) {
      var e = d(t);
      e && (clearTimeout(e), u(t, null));
    },
    N = function (t, e, n) {
      var r = n._settings;
      p(r.callback_enter, t, e, n),
        r.load_delay
          ? (function (t, e) {
              var n = e._settings.load_delay,
                r = d(t);
              r ||
                ((r = setTimeout(function () {
                  L(t, e), O(t);
                }, n)),
                u(t, r));
            })(t, n)
          : L(t, n);
    },
    C = function (t) {
      return (
        !!r &&
        ((t._observer = new IntersectionObserver(
          function (e) {
            e.forEach(function (e) {
              return (function (t) {
                return t.isIntersecting || t.intersectionRatio > 0;
              })(e)
                ? N(e.target, e, t)
                : (function (t, e, n) {
                    var r = n._settings;
                    p(r.callback_exit, t, e, n), r.load_delay && O(t);
                  })(e.target, e, t);
            });
          },
          {
            root: (e = t._settings).container === document ? null : e.container,
            rootMargin: e.thresholds || e.threshold + "px",
          }
        )),
        !0)
      );
      var e;
    },
    x = ["IMG", "IFRAME"],
    M = function (t) {
      return Array.prototype.slice.call(t);
    },
    R = function (t, e) {
      return (function (t) {
        return t.filter(function (t) {
          return !l(t);
        });
      })(
        M(
          t ||
            (function (t) {
              return t.container.querySelectorAll(t.elements_selector);
            })(e)
        )
      );
    },
    T = function (t) {
      var e = t._settings,
        n = e.container.querySelectorAll("." + e.class_error);
      M(n).forEach(function (t) {
        b(t, e.class_error),
          (function (t) {
            c(t, "was-processed", null);
          })(t);
      }),
        t.update();
    },
    j = function (n, r) {
      var a;
      (this._settings = (function (e) {
        return t({}, o, e);
      })(n)),
        (this.loadingCount = 0),
        C(this),
        this.update(r),
        (a = this),
        e &&
          window.addEventListener("online", function (t) {
            T(a);
          });
    };
  return (
    (j.prototype = {
      update: function (t) {
        var e,
          r = this,
          a = this._settings;
        ((this._elements = R(t, a)), !n && this._observer)
          ? ((function (t) {
              return t.use_native && "loading" in HTMLImageElement.prototype;
            })(a) &&
              ((e = this)._elements.forEach(function (t) {
                -1 !== x.indexOf(t.tagName) &&
                  (t.setAttribute("loading", "lazy"), z(t, e));
              }),
              (this._elements = R(t, a))),
            this._elements.forEach(function (t) {
              r._observer.observe(t);
            }))
          : this.loadAll();
      },
      destroy: function () {
        var t = this;
        this._observer &&
          (this._elements.forEach(function (e) {
            t._observer.unobserve(e);
          }),
          (this._observer = null)),
          (this._elements = null),
          (this._settings = null);
      },
      load: function (t, e) {
        z(t, this, e);
      },
      loadAll: function () {
        var t = this;
        this._elements.forEach(function (e) {
          L(e, t);
        });
      },
    }),
    e &&
      (function (t, e) {
        if (e)
          if (e.length) for (var n, r = 0; (n = e[r]); r += 1) i(t, n);
          else i(t, e);
      })(j, window.lazyLoadOptions),
    j
  );
});

/*Magic Zoom v4.5.17*/
(function () {
  if (window.magicJS) {
    return;
  }
  var b = {
    version: "v2.7.4",
    UUID: 0,
    storage: {},
    $uuid: function (d) {
      return d.$J_UUID || (d.$J_UUID = ++a.UUID);
    },
    getStorage: function (d) {
      return a.storage[d] || (a.storage[d] = {});
    },
    $F: function () {},
    $false: function () {
      return false;
    },
    defined: function (d) {
      return undefined != d;
    },
    exists: function (d) {
      return !!d;
    },
    j1: function (d) {
      if (!a.defined(d)) {
        return false;
      }
      if (d.$J_TYPE) {
        return d.$J_TYPE;
      }
      if (!!d.nodeType) {
        if (1 == d.nodeType) {
          return "element";
        }
        if (3 == d.nodeType) {
          return "textnode";
        }
      }
      if (d.length && d.item) {
        return "collection";
      }
      if (d.length && d.callee) {
        return "arguments";
      }
      if (
        (d instanceof window.Object || d instanceof window.Function) &&
        d.constructor === a.Class
      ) {
        return "class";
      }
      if (d instanceof window.Array) {
        return "array";
      }
      if (d instanceof window.Function) {
        return "function";
      }
      if (d instanceof window.String) {
        return "string";
      }
      if (a.j21.trident) {
        if (a.defined(d.cancelBubble)) {
          return "event";
        }
      } else {
        if (
          d === window.event ||
          d.constructor == window.Event ||
          d.constructor == window.MouseEvent ||
          d.constructor == window.UIEvent ||
          d.constructor == window.KeyboardEvent ||
          d.constructor == window.KeyEvent
        ) {
          return "event";
        }
      }
      if (d instanceof window.Date) {
        return "date";
      }
      if (d instanceof window.RegExp) {
        return "regexp";
      }
      if (d === window) {
        return "window";
      }
      if (d === document) {
        return "document";
      }
      return typeof d;
    },
    extend: function (j, h) {
      if (!(j instanceof window.Array)) {
        j = [j];
      }
      for (var g = 0, e = j.length; g < e; g++) {
        if (!a.defined(j)) {
          continue;
        }
        for (var f in h || {}) {
          try {
            j[g][f] = h[f];
          } catch (d) {}
        }
      }
      return j[0];
    },
    implement: function (h, g) {
      if (!(h instanceof window.Array)) {
        h = [h];
      }
      for (var f = 0, d = h.length; f < d; f++) {
        if (!a.defined(h[f])) {
          continue;
        }
        if (!h[f].prototype) {
          continue;
        }
        for (var e in g || {}) {
          if (!h[f].prototype[e]) {
            h[f].prototype[e] = g[e];
          }
        }
      }
      return h[0];
    },
    nativize: function (f, e) {
      if (!a.defined(f)) {
        return f;
      }
      for (var d in e || {}) {
        if (!f[d]) {
          f[d] = e[d];
        }
      }
      return f;
    },
    $try: function () {
      for (var f = 0, d = arguments.length; f < d; f++) {
        try {
          return arguments[f]();
        } catch (g) {}
      }
      return null;
    },
    $A: function (f) {
      if (!a.defined(f)) {
        return $mjs([]);
      }
      if (f.toArray) {
        return $mjs(f.toArray());
      }
      if (f.item) {
        var e = f.length || 0,
          d = new Array(e);
        while (e--) {
          d[e] = f[e];
        }
        return $mjs(d);
      }
      return $mjs(Array.prototype.slice.call(f));
    },
    now: function () {
      return new Date().getTime();
    },
    detach: function (h) {
      var f;
      switch (a.j1(h)) {
        case "object":
          f = {};
          for (var g in h) {
            f[g] = a.detach(h[g]);
          }
          break;
        case "array":
          f = [];
          for (var e = 0, d = h.length; e < d; e++) {
            f[e] = a.detach(h[e]);
          }
          break;
        default:
          return h;
      }
      return a.$(f);
    },
    $: function (e) {
      if (!a.defined(e)) {
        return null;
      }
      if (e.$J_EXTENDED) {
        return e;
      }
      switch (a.j1(e)) {
        case "array":
          e = a.nativize(e, a.extend(a.Array, { $J_EXTENDED: a.$F }));
          e.j14 = e.forEach;
          e.contains = a.Array.contains;
          return e;
          break;
        case "string":
          var d = document.getElementById(e);
          if (a.defined(d)) {
            return a.$(d);
          }
          return null;
          break;
        case "window":
        case "document":
          a.$uuid(e);
          e = a.extend(e, a.Doc);
          break;
        case "element":
          a.$uuid(e);
          e = a.extend(e, a.Element);
          break;
        case "event":
          e = a.extend(e, a.Event);
          break;
        case "textnode":
          return e;
          break;
        case "function":
        case "array":
        case "date":
        default:
          break;
      }
      return a.extend(e, { $J_EXTENDED: a.$F });
    },
    $new: function (d, f, e) {
      return $mjs(a.doc.createElement(d))
        .setProps(f || {})
        .j6(e || {});
    },
    addCSS: function (e) {
      if (document.styleSheets && document.styleSheets.length) {
        document.styleSheets[0].insertRule(e, 0);
      } else {
        var d = $mjs(document.createElement("style"));
        d.update(e);
        document.getElementsByTagName("head")[0].appendChild(d);
      }
    },
  };
  var a = b;
  window.magicJS = b;
  window.$mjs = b.$;
  a.Array = {
    $J_TYPE: "array",
    indexOf: function (g, h) {
      var d = this.length;
      for (
        var e = this.length, f = h < 0 ? Math.max(0, e + h) : h || 0;
        f < e;
        f++
      ) {
        if (this[f] === g) {
          return f;
        }
      }
      return -1;
    },
    contains: function (d, e) {
      return this.indexOf(d, e) != -1;
    },
    forEach: function (d, g) {
      for (var f = 0, e = this.length; f < e; f++) {
        if (f in this) {
          d.call(g, this[f], f, this);
        }
      }
    },
    filter: function (d, j) {
      var h = [];
      for (var g = 0, e = this.length; g < e; g++) {
        if (g in this) {
          var f = this[g];
          if (d.call(j, this[g], g, this)) {
            h.push(f);
          }
        }
      }
      return h;
    },
    map: function (d, h) {
      var g = [];
      for (var f = 0, e = this.length; f < e; f++) {
        if (f in this) {
          g[f] = d.call(h, this[f], f, this);
        }
      }
      return g;
    },
  };
  a.implement(String, {
    $J_TYPE: "string",
    j26: function () {
      return this.replace(/^\s+|\s+$/g, "");
    },
    eq: function (d, e) {
      return e || false
        ? this.toString() === d.toString()
        : this.toLowerCase().toString() === d.toLowerCase().toString();
    },
    j22: function () {
      return this.replace(/-\D/g, function (d) {
        return d.charAt(1).toUpperCase();
      });
    },
    dashize: function () {
      return this.replace(/[A-Z]/g, function (d) {
        return "-" + d.charAt(0).toLowerCase();
      });
    },
    j17: function (d) {
      return parseInt(this, d || 10);
    },
    toFloat: function () {
      return parseFloat(this);
    },
    j18: function () {
      return !this.replace(/true/i, "").j26();
    },
    has: function (e, d) {
      d = d || "";
      return (d + this + d).indexOf(d + e + d) > -1;
    },
  });
  b.implement(Function, {
    $J_TYPE: "function",
    j24: function () {
      var e = a.$A(arguments),
        d = this,
        f = e.shift();
      return function () {
        return d.apply(f || null, e.concat(a.$A(arguments)));
      };
    },
    j16: function () {
      var e = a.$A(arguments),
        d = this,
        f = e.shift();
      return function (g) {
        return d.apply(f || null, $mjs([g || window.event]).concat(e));
      };
    },
    j27: function () {
      var e = a.$A(arguments),
        d = this,
        f = e.shift();
      return window.setTimeout(function () {
        return d.apply(d, e);
      }, f || 0);
    },
    j28: function () {
      var e = a.$A(arguments),
        d = this;
      return function () {
        return d.j27.apply(d, e);
      };
    },
    interval: function () {
      var e = a.$A(arguments),
        d = this,
        f = e.shift();
      return window.setInterval(function () {
        return d.apply(d, e);
      }, f || 0);
    },
  });
  var c = navigator.userAgent.toLowerCase();
  a.j21 = {
    features: {
      xpath: !!document.evaluate,
      air: !!window.runtime,
      query: !!document.querySelector,
    },
    touchScreen: (function () {
      return (
        "ontouchstart" in window ||
        (window.DocumentTouch && document instanceof DocumentTouch)
      );
    })(),
    mobile: c.match(
      /android|tablet|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(j21|link)|vodafone|wap|windows (ce|phone)|xda|xiino/
    )
      ? true
      : false,
    engine: window.opera
      ? "presto"
      : !!window.ActiveXObject
      ? "trident"
      : undefined != document.getBoxObjectFor || null != window.mozInnerScreenY
      ? "gecko"
      : null != window.WebKitPoint || !navigator.taintEnabled
      ? "webkit"
      : "unknown",
    version: "",
    ieMode: 0,
    platform: c.match(/ip(?:ad|od|hone)/)
      ? "ios"
      : (c.match(/(?:webos|android)/) ||
          navigator.platform.match(/mac|win|linux/i) || [
            "other",
          ])[0].toLowerCase(),
    backCompat:
      document.compatMode && "backcompat" == document.compatMode.toLowerCase(),
    getDoc: function () {
      return document.compatMode &&
        "backcompat" == document.compatMode.toLowerCase()
        ? document.body
        : document.documentElement;
    },
    requestAnimationFrame:
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      undefined,
    cancelAnimationFrame:
      window.cancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      window.webkitCancelRequestAnimationFrame ||
      undefined,
    ready: false,
    onready: function () {
      if (a.j21.ready) {
        return;
      }
      a.j21.ready = true;
      a.body = $mjs(document.body);
      a.win = $mjs(window);
      (function () {
        a.j21.css3Transformations = { capable: false, prefix: "" };
        if (typeof document.body.style.transform !== "undefined") {
          a.j21.css3Transformations.capable = true;
        } else {
          var f = "Webkit Moz O ms Khtml".split(" ");
          for (var e = 0, d = f.length; e < d; e++) {
            a.j21.css3Transformations.prefix = f[e];
            if (
              typeof document.body.style[
                a.j21.css3Transformations.prefix + "Transform"
              ] !== "undefined"
            ) {
              a.j21.css3Transformations.capable = true;
              break;
            }
          }
        }
      })();
      (function () {
        a.j21.css3Animation = { capable: false, prefix: "" };
        if (typeof document.body.style.animationName !== "undefined") {
          a.j21.css3Animation.capable = true;
        } else {
          var f = "Webkit Moz O ms Khtml".split(" ");
          for (var e = 0, d = f.length; e < d; e++) {
            a.j21.css3Animation.prefix = f[e];
            if (
              typeof document.body.style[
                a.j21.css3Animation.prefix + "AnimationName"
              ] !== "undefined"
            ) {
              a.j21.css3Animation.capable = true;
              break;
            }
          }
        }
      })();
      $mjs(document).raiseEvent("domready");
    },
  };
  (function () {
    function d() {
      return !!arguments.callee.caller;
    }
    a.j21.version =
      "presto" == a.j21.engine
        ? !!document.head
          ? 270
          : !!window.applicationCache
          ? 260
          : !!window.localStorage
          ? 250
          : a.j21.features.query
          ? 220
          : d()
          ? 211
          : document.getElementsByClassName
          ? 210
          : 200
        : "trident" == a.j21.engine
        ? !!(window.msPerformance || window.performance)
          ? 900
          : !!(window.XMLHttpRequest && window.postMessage)
          ? 6
          : window.XMLHttpRequest
          ? 5
          : 4
        : "webkit" == a.j21.engine
        ? a.j21.features.xpath
          ? a.j21.features.query
            ? 525
            : 420
          : 419
        : "gecko" == a.j21.engine
        ? !!document.head
          ? 200
          : !!document.readyState
          ? 192
          : !!window.localStorage
          ? 191
          : document.getElementsByClassName
          ? 190
          : 181
        : "";
    a.j21[a.j21.engine] = a.j21[a.j21.engine + a.j21.version] = true;
    if (window.chrome) {
      a.j21.chrome = true;
    }
    a.j21.ieMode = !a.j21.trident
      ? 0
      : document.documentMode
      ? document.documentMode
      : (function () {
          var e = 0;
          if (a.j21.backCompat) {
            return 5;
          }
          switch (a.j21.version) {
            case 4:
              e = 6;
              break;
            case 5:
              e = 7;
              break;
            case 6:
              e = 8;
              break;
            case 900:
              e = 9;
              break;
          }
          return e;
        })();
  })();
  (function () {
    a.j21.fullScreen = {
      capable: false,
      enabled: function () {
        return false;
      },
      request: function () {},
      cancel: function () {},
      changeEventName: "",
      errorEventName: "",
      prefix: "",
    };
    if (typeof document.cancelFullScreen != "undefined") {
      a.j21.fullScreen.capable = true;
    } else {
      var f = "webkit moz o ms khtml".split(" ");
      for (var e = 0, d = f.length; e < d; e++) {
        a.j21.fullScreen.prefix = f[e];
        if (
          typeof document[a.j21.fullScreen.prefix + "CancelFullScreen"] !=
          "undefined"
        ) {
          a.j21.fullScreen.capable = true;
          break;
        }
      }
    }
    if (a.j21.fullScreen.capable) {
      a.j21.fullScreen.changeEventName =
        a.j21.fullScreen.prefix + "fullscreenchange";
      a.j21.fullScreen.errorEventName =
        a.j21.fullScreen.prefix + "fullscreenerror";
      a.j21.fullScreen.enabled = function () {
        switch (this.prefix) {
          case "":
            return document.fullScreen;
          case "webkit":
            return document.webkitIsFullScreen;
          default:
            return document[this.prefix + "FullScreen"];
        }
      };
      a.j21.fullScreen.request = function (g) {
        return this.prefix === ""
          ? g.requestFullScreen()
          : g[this.prefix + "RequestFullScreen"]();
      };
      a.j21.fullScreen.cancel = function (g) {
        return this.prefix === ""
          ? document.cancelFullScreen()
          : document[this.prefix + "CancelFullScreen"]();
      };
    }
  })();
  a.Element = {
    j13: function (d) {
      return this.className.has(d, " ");
    },
    j2: function (d) {
      if (d && !this.j13(d)) {
        this.className += (this.className ? " " : "") + d;
      }
      return this;
    },
    j3: function (d) {
      d = d || ".*";
      this.className = this.className
        .replace(new RegExp("(^|\\s)" + d + "(?:\\s|$)"), "$1")
        .j26();
      return this;
    },
    j4: function (d) {
      return this.j13(d) ? this.j3(d) : this.j2(d);
    },
    j5: function (f) {
      f = f == "float" && this.currentStyle ? "styleFloat" : f.j22();
      var d = null,
        e = null;
      if (this.currentStyle) {
        d = this.currentStyle[f];
      } else {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          e = document.defaultView.getComputedStyle(this, null);
          d = e ? e.getPropertyValue([f.dashize()]) : null;
        }
      }
      if (!d) {
        d = this.style[f];
      }
      if ("opacity" == f) {
        return a.defined(d) ? parseFloat(d) : 1;
      }
      if (
        /^(border(Top|Bottom|Left|Right)Width)|((padding|margin)(Top|Bottom|Left|Right))$/.test(
          f
        )
      ) {
        d = parseInt(d) ? d : "0px";
      }
      return "auto" == d ? null : d;
    },
    j6Prop: function (f, d) {
      try {
        if ("opacity" == f) {
          this.j23(d);
          return this;
        } else {
          if ("float" == f) {
            this.style[
              "undefined" === typeof this.style.styleFloat
                ? "cssFloat"
                : "styleFloat"
            ] = d;
            return this;
          } else {
            if (a.j21.css3Transformations && /transform/.test(f)) {
            }
          }
        }
        this.style[f.j22()] =
          d +
          ("number" == a.j1(d) && !$mjs(["zIndex", "zoom"]).contains(f.j22())
            ? "px"
            : "");
      } catch (g) {}
      return this;
    },
    j6: function (e) {
      for (var d in e) {
        this.j6Prop(d, e[d]);
      }
      return this;
    },
    j19s: function () {
      var d = {};
      a.$A(arguments).j14(function (e) {
        d[e] = this.j5(e);
      }, this);
      return d;
    },
    j23: function (h, e) {
      e = e || false;
      h = parseFloat(h);
      if (e) {
        if (h == 0) {
          if ("hidden" != this.style.visibility) {
            this.style.visibility = "hidden";
          }
        } else {
          if ("visible" != this.style.visibility) {
            this.style.visibility = "visible";
          }
        }
      }
      if (a.j21.trident) {
        if (!this.currentStyle || !this.currentStyle.hasLayout) {
          this.style.zoom = 1;
        }
        try {
          var g = this.filters.item("DXImageTransform.Microsoft.Alpha");
          g.enabled = 1 != h;
          g.opacity = h * 100;
        } catch (d) {
          this.style.filter +=
            1 == h
              ? ""
              : "progid:DXImageTransform.Microsoft.Alpha(enabled=true,opacity=" +
                h * 100 +
                ")";
        }
      }
      this.style.opacity = h;
      return this;
    },
    setProps: function (d) {
      for (var e in d) {
        this.setAttribute(e, "" + d[e]);
      }
      return this;
    },
    hide: function () {
      return this.j6({ display: "none", visibility: "hidden" });
    },
    show: function () {
      return this.j6({ display: "block", visibility: "visible" });
    },
    j7: function () {
      return { width: this.offsetWidth, height: this.offsetHeight };
    },
    j10: function () {
      return { top: this.scrollTop, left: this.scrollLeft };
    },
    j11: function () {
      var d = this,
        e = { top: 0, left: 0 };
      do {
        e.left += d.scrollLeft || 0;
        e.top += d.scrollTop || 0;
        d = d.parentNode;
      } while (d);
      return e;
    },
    j8: function () {
      if (a.defined(document.documentElement.getBoundingClientRect)) {
        var d = this.getBoundingClientRect(),
          f = $mjs(document).j10(),
          h = a.j21.getDoc();
        return {
          top: d.top + f.y - h.clientTop,
          left: d.left + f.x - h.clientLeft,
        };
      }
      var g = this,
        e = (t = 0);
      do {
        e += g.offsetLeft || 0;
        t += g.offsetTop || 0;
        g = g.offsetParent;
      } while (g && !/^(?:body|html)$/i.test(g.tagName));
      return { top: t, left: e };
    },
    j9: function () {
      var e = this.j8();
      var d = this.j7();
      return {
        top: e.top,
        bottom: e.top + d.height,
        left: e.left,
        right: e.left + d.width,
      };
    },
    changeContent: function (f) {
      try {
        this.innerHTML = f;
      } catch (d) {
        this.innerText = f;
      }
      return this;
    },
    j33: function () {
      return this.parentNode ? this.parentNode.removeChild(this) : this;
    },
    kill: function () {
      a.$A(this.childNodes).j14(function (d) {
        if (3 == d.nodeType || 8 == d.nodeType) {
          return;
        }
        $mjs(d).kill();
      });
      this.j33();
      this.je3();
      if (this.$J_UUID) {
        a.storage[this.$J_UUID] = null;
        delete a.storage[this.$J_UUID];
      }
      return null;
    },
    append: function (g, e) {
      e = e || "bottom";
      var d = this.firstChild;
      "top" == e && d ? this.insertBefore(g, d) : this.appendChild(g);
      return this;
    },
    j32: function (f, e) {
      var d = $mjs(f).append(this, e);
      return this;
    },
    enclose: function (d) {
      this.append(d.parentNode.replaceChild(this, d));
      return this;
    },
    hasChild: function (d) {
      if (
        "element" !==
        a.j1("string" == a.j1(d) ? (d = document.getElementById(d)) : d)
      ) {
        return false;
      }
      return this == d
        ? false
        : this.contains && !a.j21.webkit419
        ? this.contains(d)
        : this.compareDocumentPosition
        ? !!(this.compareDocumentPosition(d) & 16)
        : a.$A(this.byTag(d.tagName)).contains(d);
    },
  };
  a.Element.j19 = a.Element.j5;
  a.Element.j20 = a.Element.j6;
  if (!window.Element) {
    window.Element = a.$F;
    if (a.j21.engine.webkit) {
      window.document.createElement("iframe");
    }
    window.Element.prototype = a.j21.engine.webkit
      ? window["[[DOMElement.prototype]]"]
      : {};
  }
  a.implement(window.Element, { $J_TYPE: "element" });
  a.Doc = {
    j7: function () {
      if (a.j21.presto925 || a.j21.webkit419) {
        return { width: window.innerWidth, height: window.innerHeight };
      }
      return {
        width: a.j21.getDoc().clientWidth,
        height: a.j21.getDoc().clientHeight,
      };
    },
    j10: function () {
      return {
        x: window.pageXOffset || a.j21.getDoc().scrollLeft,
        y: window.pageYOffset || a.j21.getDoc().scrollTop,
      };
    },
    j12: function () {
      var d = this.j7();
      return {
        width: Math.max(a.j21.getDoc().scrollWidth, d.width),
        height: Math.max(a.j21.getDoc().scrollHeight, d.height),
      };
    },
  };
  a.extend(document, { $J_TYPE: "document" });
  a.extend(window, { $J_TYPE: "window" });
  a.extend([a.Element, a.Doc], {
    j29: function (g, e) {
      var d = a.getStorage(this.$J_UUID),
        f = d[g];
      if (undefined != e && undefined == f) {
        f = d[g] = e;
      }
      return a.defined(f) ? f : null;
    },
    j30: function (f, e) {
      var d = a.getStorage(this.$J_UUID);
      d[f] = e;
      return this;
    },
    j31: function (e) {
      var d = a.getStorage(this.$J_UUID);
      delete d[e];
      return this;
    },
  });
  if (
    !(
      window.HTMLElement &&
      window.HTMLElement.prototype &&
      window.HTMLElement.prototype.getElementsByClassName
    )
  ) {
    a.extend([a.Element, a.Doc], {
      getElementsByClassName: function (d) {
        return a.$A(this.getElementsByTagName("*")).filter(function (g) {
          try {
            return 1 == g.nodeType && g.className.has(d, " ");
          } catch (f) {}
        });
      },
    });
  }
  a.extend([a.Element, a.Doc], {
    byClass: function () {
      return this.getElementsByClassName(arguments[0]);
    },
    byTag: function () {
      return this.getElementsByTagName(arguments[0]);
    },
  });
  if (a.j21.fullScreen.capable) {
    a.Element.requestFullScreen = function () {
      a.j21.fullScreen.request(this);
    };
  }
  a.Event = {
    $J_TYPE: "event",
    stop: function () {
      if (this.stopPropagation) {
        this.stopPropagation();
      } else {
        this.cancelBubble = true;
      }
      if (this.preventDefault) {
        this.preventDefault();
      } else {
        this.returnValue = false;
      }
      return this;
    },
    j15: function () {
      var e, d;
      e = /touch/i.test(this.type) ? this.changedTouches[0] : this;
      return !a.defined(e)
        ? { x: 0, y: 0 }
        : {
            x: e.pageX || e.clientX + a.j21.getDoc().scrollLeft,
            y: e.pageY || e.clientY + a.j21.getDoc().scrollTop,
          };
    },
    getTarget: function () {
      var d = this.target || this.srcElement;
      while (d && 3 == d.nodeType) {
        d = d.parentNode;
      }
      return d;
    },
    getRelated: function () {
      var e = null;
      switch (this.type) {
        case "mouseover":
          e = this.relatedTarget || this.fromElement;
          break;
        case "mouseout":
          e = this.relatedTarget || this.toElement;
          break;
        default:
          return e;
      }
      try {
        while (e && 3 == e.nodeType) {
          e = e.parentNode;
        }
      } catch (d) {
        e = null;
      }
      return e;
    },
    getButton: function () {
      if (!this.which && this.button !== undefined) {
        return this.button & 1
          ? 1
          : this.button & 2
          ? 3
          : this.button & 4
          ? 2
          : 0;
      }
      return this.which;
    },
  };
  a._event_add_ = "addEventListener";
  a._event_del_ = "removeEventListener";
  a._event_prefix_ = "";
  if (!document.addEventListener) {
    a._event_add_ = "attachEvent";
    a._event_del_ = "detachEvent";
    a._event_prefix_ = "on";
  }
  a.extend([a.Element, a.Doc], {
    je1: function (g, f) {
      var i = "domready" == g ? false : true,
        e = this.j29("events", {});
      e[g] = e[g] || {};
      if (e[g].hasOwnProperty(f.$J_EUID)) {
        return this;
      }
      if (!f.$J_EUID) {
        f.$J_EUID = Math.floor(Math.random() * a.now());
      }
      var d = this,
        h = function (j) {
          return f.call(d);
        };
      if ("domready" == g) {
        if (a.j21.ready) {
          f.call(this);
          return this;
        }
      }
      if (i) {
        h = function (j) {
          j = a.extend(j || window.e, { $J_TYPE: "event" });
          return f.call(d, $mjs(j));
        };
        this[a._event_add_](a._event_prefix_ + g, h, false);
      }
      e[g][f.$J_EUID] = h;
      return this;
    },
    je2: function (g) {
      var i = "domready" == g ? false : true,
        e = this.j29("events");
      if (!e || !e[g]) {
        return this;
      }
      var h = e[g],
        f = arguments[1] || null;
      if (g && !f) {
        for (var d in h) {
          if (!h.hasOwnProperty(d)) {
            continue;
          }
          this.je2(g, d);
        }
        return this;
      }
      f = "function" == a.j1(f) ? f.$J_EUID : f;
      if (!h.hasOwnProperty(f)) {
        return this;
      }
      if ("domready" == g) {
        i = false;
      }
      if (i) {
        this[a._event_del_](a._event_prefix_ + g, h[f], false);
      }
      delete h[f];
      return this;
    },
    raiseEvent: function (h, f) {
      var m = "domready" == h ? false : true,
        l = this,
        j;
      if (!m) {
        var g = this.j29("events");
        if (!g || !g[h]) {
          return this;
        }
        var i = g[h];
        for (var d in i) {
          if (!i.hasOwnProperty(d)) {
            continue;
          }
          i[d].call(this);
        }
        return this;
      }
      if (l === document && document.createEvent && !l.dispatchEvent) {
        l = document.documentElement;
      }
      if (document.createEvent) {
        j = document.createEvent(h);
        j.initEvent(f, true, true);
      } else {
        j = document.createEventObject();
        j.eventType = h;
      }
      if (document.createEvent) {
        l.dispatchEvent(j);
      } else {
        l.fireEvent("on" + f, j);
      }
      return j;
    },
    je3: function () {
      var d = this.j29("events");
      if (!d) {
        return this;
      }
      for (var e in d) {
        this.je2(e);
      }
      this.j31("events");
      return this;
    },
  });
  (function () {
    if ("complete" === document.readyState) {
      return a.j21.onready.j27(1);
    }
    if (a.j21.webkit && a.j21.version < 420) {
      (function () {
        $mjs(["loaded", "complete"]).contains(document.readyState)
          ? a.j21.onready()
          : arguments.callee.j27(50);
      })();
    } else {
      if (a.j21.trident && a.j21.ieMode < 9 && window == top) {
        (function () {
          a.$try(function () {
            a.j21.getDoc().doScroll("left");
            return true;
          })
            ? a.j21.onready()
            : arguments.callee.j27(50);
        })();
      } else {
        $mjs(document).je1("DOMContentLoaded", a.j21.onready);
        $mjs(window).je1("load", a.j21.onready);
      }
    }
  })();
  a.Class = function () {
    var h = null,
      e = a.$A(arguments);
    if ("class" == a.j1(e[0])) {
      h = e.shift();
    }
    var d = function () {
      for (var l in this) {
        this[l] = a.detach(this[l]);
      }
      if (this.constructor.$parent) {
        this.$parent = {};
        var o = this.constructor.$parent;
        for (var n in o) {
          var j = o[n];
          switch (a.j1(j)) {
            case "function":
              this.$parent[n] = a.Class.wrap(this, j);
              break;
            case "object":
              this.$parent[n] = a.detach(j);
              break;
            case "array":
              this.$parent[n] = a.detach(j);
              break;
          }
        }
      }
      var i = this.init ? this.init.apply(this, arguments) : this;
      delete this.caller;
      return i;
    };
    if (!d.prototype.init) {
      d.prototype.init = a.$F;
    }
    if (h) {
      var g = function () {};
      g.prototype = h.prototype;
      d.prototype = new g();
      d.$parent = {};
      for (var f in h.prototype) {
        d.$parent[f] = h.prototype[f];
      }
    } else {
      d.$parent = null;
    }
    d.constructor = a.Class;
    d.prototype.constructor = d;
    a.extend(d.prototype, e[0]);
    a.extend(d, { $J_TYPE: "class" });
    return d;
  };
  b.Class.wrap = function (d, e) {
    return function () {
      var g = this.caller;
      var f = e.apply(d, arguments);
      return f;
    };
  };
  a.win = $mjs(window);
  a.doc = $mjs(document);
})();
(function (b) {
  if (!b) {
    throw "MagicJS not found";
    return;
  }
  if (b.FX) {
    return;
  }
  var a = b.$;
  b.FX = new b.Class({
    options: {
      fps: 60,
      duration: 500,
      transition: function (c) {
        return -(Math.cos(Math.PI * c) - 1) / 2;
      },
      onStart: b.$F,
      onComplete: b.$F,
      onBeforeRender: b.$F,
      onAfterRender: b.$F,
      forceAnimation: false,
      roundCss: true,
    },
    styles: null,
    init: function (d, c) {
      this.el = a(d);
      this.options = b.extend(this.options, c);
      this.timer = false;
    },
    start: function (c) {
      this.styles = c;
      this.state = 0;
      this.curFrame = 0;
      this.startTime = b.now();
      this.finishTime = this.startTime + this.options.duration;
      this.loopBind = this.loop.j24(this);
      this.options.onStart.call();
      if (!this.options.forceAnimation && b.j21.requestAnimationFrame) {
        this.timer = b.j21.requestAnimationFrame.call(window, this.loopBind);
      } else {
        this.timer = this.loop
          .j24(this)
          .interval(Math.round(1000 / this.options.fps));
      }
      return this;
    },
    stopAnimation: function () {
      if (this.timer) {
        if (
          !this.options.forceAnimation &&
          b.j21.requestAnimationFrame &&
          b.j21.cancelAnimationFrame
        ) {
          b.j21.cancelAnimationFrame.call(window, this.timer);
        } else {
          clearInterval(this.timer);
        }
        this.timer = false;
      }
    },
    stop: function (c) {
      c = b.defined(c) ? c : false;
      this.stopAnimation();
      if (c) {
        this.render(1);
        this.options.onComplete.j27(10);
      }
      return this;
    },
    calc: function (e, d, c) {
      return (d - e) * c + e;
    },
    loop: function () {
      var d = b.now();
      if (d >= this.finishTime) {
        this.stopAnimation();
        this.render(1);
        this.options.onComplete.j27(10);
        return this;
      }
      var c = this.options.transition(
        (d - this.startTime) / this.options.duration
      );
      if (!this.options.forceAnimation && b.j21.requestAnimationFrame) {
        this.timer = b.j21.requestAnimationFrame.call(window, this.loopBind);
      }
      this.render(c);
    },
    render: function (c) {
      var d = {};
      for (var e in this.styles) {
        if ("opacity" === e) {
          d[e] =
            Math.round(
              this.calc(this.styles[e][0], this.styles[e][1], c) * 100
            ) / 100;
        } else {
          d[e] = this.calc(this.styles[e][0], this.styles[e][1], c);
          if (this.options.roundCss) {
            d[e] = Math.round(d[e]);
          }
        }
      }
      this.options.onBeforeRender(d);
      this.set(d);
      this.options.onAfterRender(d);
    },
    set: function (c) {
      return this.el.j6(c);
    },
  });
  b.FX.Transition = {
    linear: function (c) {
      return c;
    },
    sineIn: function (c) {
      return -(Math.cos(Math.PI * c) - 1) / 2;
    },
    sineOut: function (c) {
      return 1 - b.FX.Transition.sineIn(1 - c);
    },
    expoIn: function (c) {
      return Math.pow(2, 8 * (c - 1));
    },
    expoOut: function (c) {
      return 1 - b.FX.Transition.expoIn(1 - c);
    },
    quadIn: function (c) {
      return Math.pow(c, 2);
    },
    quadOut: function (c) {
      return 1 - b.FX.Transition.quadIn(1 - c);
    },
    cubicIn: function (c) {
      return Math.pow(c, 3);
    },
    cubicOut: function (c) {
      return 1 - b.FX.Transition.cubicIn(1 - c);
    },
    backIn: function (d, c) {
      c = c || 1.618;
      return Math.pow(d, 2) * ((c + 1) * d - c);
    },
    backOut: function (d, c) {
      return 1 - b.FX.Transition.backIn(1 - d);
    },
    elasticIn: function (d, c) {
      c = c || [];
      return (
        Math.pow(2, 10 * --d) * Math.cos((20 * d * Math.PI * (c[0] || 1)) / 3)
      );
    },
    elasticOut: function (d, c) {
      return 1 - b.FX.Transition.elasticIn(1 - d, c);
    },
    bounceIn: function (e) {
      for (var d = 0, c = 1; 1; d += c, c /= 2) {
        if (e >= (7 - 4 * d) / 11) {
          return c * c - Math.pow((11 - 6 * d - 11 * e) / 4, 2);
        }
      }
    },
    bounceOut: function (c) {
      return 1 - b.FX.Transition.bounceIn(1 - c);
    },
    none: function (c) {
      return 0;
    },
  };
})(magicJS);
(function (b) {
  if (!b) {
    throw "MagicJS not found";
    return;
  }
  if (b.PFX) {
    return;
  }
  var a = b.$;
  b.PFX = new b.Class(b.FX, {
    init: function (c, d) {
      this.el_arr = c;
      this.options = b.extend(this.options, d);
      this.timer = false;
    },
    start: function (c) {
      this.$parent.start([]);
      this.styles_arr = c;
      return this;
    },
    render: function (c) {
      for (var d = 0; d < this.el_arr.length; d++) {
        this.el = a(this.el_arr[d]);
        this.styles = this.styles_arr[d];
        this.$parent.render(c);
      }
    },
  });
})(magicJS);
var MagicZoom = (function (c) {
  var d = c.$;
  c.$Ff = function (f) {
    $mjs(f).stop();
    return false;
  };
  c.insertCSS = function (f, h, l) {
    var i,
      g,
      j,
      k = [],
      e = -1;
    l || (l = c.stylesId);
    i =
      c.$(l) ||
      (document.head || document.body).appendChild(
        c.$new("style", { id: l, type: "text/css" })
      );
    g = i.sheet || i.styleSheet;
    if ("object" == c.j1(h)) {
      for (j in h) {
        k.push(j + ":" + h[j]);
      }
      h = k.join(";");
    }
    if (g.insertRule) {
      e = g.insertRule(f + " {" + h + "}", g.cssRules.length);
    } else {
      e = g.addRule(f, h);
    }
    return e;
  };
  var a = {
    version: "v4.5.17",
    options: {},
    defaults: {
      opacity: 50,
      opacityReverse: false,
      smoothingSpeed: 40,
      fps: 25,
      zoomWidth: 300,
      zoomHeight: 300,
      zoomDistance: 15,
      zoomPosition: "right",
      zoomAlign: "top",
      zoomWindowEffect: "shadow",
      dragMode: false,
      moveOnClick: true,
      alwaysShowZoom: false,
      preservePosition: false,
      x: -1,
      y: -1,
      clickToActivate: false,
      clickToDeactivate: false,
      initializeOn: "load",
      smoothing: true,
      showTitle: "top",
      titleSource: "title",
      zoomFade: true,
      zoomFadeInSpeed: 400,
      zoomFadeOutSpeed: 200,
      hotspots: "",
      hint: true,
      hintText: "",
      hintPosition: "tl",
      hintOpacity: 75,
      hintClass: "MagicZoomHint",
      showLoading: true,
      loadingMsg: "Loading zoom...",
      loadingClass: "MagicZoomLoading",
      loadingOpacity: 75,
      loadingPositionX: -1,
      loadingPositionY: -1,
      selectorsChange: "click",
      selectorsMouseoverDelay: 60,
      selectorsEffect: "dissolve",
      selectorsEffectSpeed: 400,
      preloadSelectorsSmall: true,
      preloadSelectorsBig: false,
      selectorsClass: "",
      fitZoomWindow: true,
      entireImage: false,
      rightClick: false,
      disableZoom: false,
      onready: c.$F,
    },
    z39: $mjs([
      /^(opacity)(\s+)?:(\s+)?(\d+)$/i,
      /^(opacity-reverse)(\s+)?:(\s+)?(true|false)$/i,
      /^(smoothing\-speed)(\s+)?:(\s+)?(\d+)$/i,
      /^(fps)(\s+)?:(\s+)?(\d+)$/i,
      /^(zoom\-width)(\s+)?:(\s+)?(\d+\%?)(px)?/i,
      /^(zoom\-height)(\s+)?:(\s+)?(\d+\%?)(px)?/i,
      /^(zoom\-distance)(\s+)?:(\s+)?(\d+)(px)?/i,
      /^(zoom\-position)(\s+)?:(\s+)?(right|left|top|bottom|custom|inner|#([a-z0-9_\-:\.]+))$/i,
      /^(zoom\-align)(\s+)?:(\s+)?(right|left|top|bottom|center)$/i,
      /^(zoom\-fit\-screen)(\s+)?:(\s+)?(true|false)$/i,
      /^(zoom\-window\-effect)(\s+)?:(\s+)?(shadow|glow|false)$/i,
      /^(drag\-mode)(\s+)?:(\s+)?(true|false)$/i,
      /^(move\-on\-click)(\s+)?:(\s+)?(true|false)$/i,
      /^(always\-show\-zoom)(\s+)?:(\s+)?(true|false)$/i,
      /^(preserve\-position)(\s+)?:(\s+)?(true|false)$/i,
      /^(x)(\s+)?:(\s+)?([\d.]+)(px)?/i,
      /^(y)(\s+)?:(\s+)?([\d.]+)(px)?/i,
      /^(click\-to\-activate)(\s+)?:(\s+)?(true|false)$/i,
      /^(click\-to\-deactivate)(\s+)?:(\s+)?(true|false)$/i,
      /^(initialize\-on)(\s+)?:(\s+)?(load|click|mouseover)$/i,
      /^(click\-to\-initialize)(\s+)?:(\s+)?(true|false)$/i,
      /^(smoothing)(\s+)?:(\s+)?(true|false)$/i,
      /^(show\-title)(\s+)?:(\s+)?(true|false|top|bottom)$/i,
      /^(title\-source)(\s+)?:(\s+)?(title|#([a-z0-9_\-:\.]+))$/i,
      /^(zoom\-fade)(\s+)?:(\s+)?(true|false)$/i,
      /^(zoom\-fade\-in\-speed)(\s+)?:(\s+)?(\d+)$/i,
      /^(zoom\-fade\-out\-speed)(\s+)?:(\s+)?(\d+)$/i,
      /^(hotspots)(\s+)?:(\s+)?([a-z0-9_\-:\.]+)$/i,
      /^(hint)(\s+)?:(\s+)?(true|false)/i,
      /^(hint\-text)(\s+)?:(\s+)?([^;]*)$/i,
      /^(hint\-opacity)(\s+)?:(\s+)?(\d+)$/i,
      /^(hint\-position)(\s+)?:(\s+)?(tl|tr|tc|bl|br|bc)/i,
      /^(show\-loading)(\s+)?:(\s+)?(true|false)$/i,
      /^(loading\-msg)(\s+)?:(\s+)?([^;]*)$/i,
      /^(loading\-opacity)(\s+)?:(\s+)?(\d+)$/i,
      /^(loading\-position\-x)(\s+)?:(\s+)?(\d+)(px)?/i,
      /^(loading\-position\-y)(\s+)?:(\s+)?(\d+)(px)?/i,
      /^(thumb\-change)(\s+)?:(\s+)?(click|mouseover)$/i,
      /^(selectors\-change)(\s+)?:(\s+)?(click|mouseover)$/i,
      /^(selectors\-mouseover\-delay)(\s+)?:(\s+)?(\d+)$/i,
      /^(selectors\-effect)(\s+)?:(\s+)?(dissolve|fade|pounce|false)$/i,
      /^(selectors\-effect\-speed)(\s+)?:(\s+)?(\d+)$/i,
      /^(selectors\-class)(\s+)?:(\s+)?([a-z0-9_\-:\.]+)$/i,
      /^(fit\-zoom\-window)(\s+)?:(\s+)?(true|false)$/i,
      /^(preload\-selectors\-small)(\s+)?:(\s+)?(true|false)$/i,
      /^(preload\-selectors\-big)(\s+)?:(\s+)?(true|false)$/i,
      /^(entire\-image)(\s+)?:(\s+)?(true|false)$/i,
      /^(right\-click)(\s+)?:(\s+)?(true|false)$/i,
      /^(disable\-zoom)(\s+)?:(\s+)?(true|false)$/i,
    ]),
    zooms: $mjs([]),
    z8: function (h) {
      var g = /(click|mouseover)/i;
      for (var f = 0; f < a.zooms.length; f++) {
        if (a.zooms[f].z30 && !a.zooms[f].activatedEx) {
          a.zooms[f].pause();
        } else {
          if (
            g.test(a.zooms[f].options.initializeOn) &&
            a.zooms[f].initMouseEvent
          ) {
            a.zooms[f].initMouseEvent = h;
          }
        }
      }
    },
    stop: function (f) {
      var e = $mjs([]);
      if (f) {
        if ((f = $mjs(f)) && f.zoom) {
          e.push(f);
        } else {
          return false;
        }
      } else {
        e = $mjs(
          c.$A(c.body.byTag("A")).filter(function (g) {
            return (" " + g.className + " ").match(/\sMagicZoom\s/) && g.zoom;
          })
        );
      }
      e.j14(function (g) {
        g.zoom && g.zoom.stop();
      }, this);
    },
    start: function (e) {
      if (0 == arguments.length) {
        a.refresh();
        return true;
      }
      e = $mjs(e);
      if (
        !e ||
        !(" " + e.className + " ").match(/\s(MagicZoom|MagicZoomPlus)\s/)
      ) {
        return false;
      }
      if (!e.zoom) {
        var f = null;
        while ((f = e.firstChild)) {
          if (f.tagName == "IMG") {
            break;
          }
          e.removeChild(f);
        }
        while ((f = e.lastChild)) {
          if (f.tagName == "IMG") {
            break;
          }
          e.removeChild(f);
        }
        if (!e.firstChild || e.firstChild.tagName != "IMG") {
          throw "Invalid Magic Zoom";
        }
        a.zooms.push(
          new a.zoom(e, arguments.length > 1 ? arguments[1] : undefined)
        );
      } else {
        e.zoom.start();
      }
    },
    update: function (h, e, g, f) {
      if ((h = $mjs(h)) && h.zoom) {
        (null === e || "" === e) && (e = undefined);
        (null === g || "" === g) && (g = undefined);
        h.zoom.update(e, g, f);
        return true;
      }
      return false;
    },
    refresh: function () {
      c.$A(window.document.getElementsByTagName("A")).j14(function (e) {
        if (e.className.has("MagicZoom", " ")) {
          if (a.stop(e)) {
            a.start.j27(100, e);
          } else {
            a.start(e);
          }
        }
      }, this);
    },
    show: function (e) {
      return a.zoomIn(e);
    },
    zoomIn: function (e) {
      if ((e = $mjs(e)) && e.zoom) {
        return e.zoom.activate();
      }
      return false;
    },
    zoomOut: function (e) {
      if ((e = $mjs(e)) && e.zoom) {
        return e.zoom.pause();
      }
      return false;
    },
    getXY: function (e) {
      if ((e = $mjs(e)) && e.zoom) {
        return { x: e.zoom.options.x, y: e.zoom.options.y };
      }
    },
    x7: function (g) {
      var f, e;
      f = "";
      for (e = 0; e < g.length; e++) {
        f += String.fromCharCode(14 ^ g.charCodeAt(e));
      }
      return f;
    },
  };
  a.z48 = function () {
    this.init.apply(this, arguments);
  };
  a.z48.prototype = {
    init: function (e) {
      this.cb = null;
      this.z9 = null;
      this.onErrorHandler = this.onError.j16(this);
      this.z10 = null;
      this.width = 0;
      this.height = 0;
      this.naturalWidth = 0;
      this.naturalHeight = 0;
      this.border = { left: 0, right: 0, top: 0, bottom: 0 };
      this.padding = { left: 0, right: 0, top: 0, bottom: 0 };
      this.ready = false;
      this._tmpp = null;
      if ("string" == c.j1(e)) {
        this._tmpp = c
          .$new("div")
          .j2("magic-temporary-img")
          .j6({
            position: "absolute",
            top: "-10000px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          })
          .j32(c.body);
        this.self = c.$new("img").j32(this._tmpp);
        this.z11();
        this.self.src = e;
      } else {
        this.self = $mjs(e);
        this.z11();
        this.self.src = e.src;
      }
    },
    _cleanup: function () {
      if (this._tmpp) {
        if (this.self.parentNode == this._tmpp) {
          this.self.j33().j6({ position: "static", top: "auto" });
        }
        this._tmpp.kill();
        this._tmpp = null;
      }
    },
    onError: function (f) {
      if (f) {
        $mjs(f).stop();
      }
      if (this.cb) {
        this._cleanup();
        this.cb.call(this, false);
      }
      this.unload();
    },
    z11: function (e) {
      this.z9 = null;
      if (
        e == true ||
        !(
          this.self.src &&
          (this.self.complete || this.self.readyState == "complete")
        )
      ) {
        this.z9 = function (f) {
          if (f) {
            $mjs(f).stop();
          }
          if (this.ready) {
            return;
          }
          this.ready = true;
          this.z13();
          if (this.cb) {
            this._cleanup();
            this.cb.call();
          }
        }.j16(this);
        this.self.je1("load", this.z9);
        $mjs(["abort", "error"]).j14(function (f) {
          this.self.je1(f, this.onErrorHandler);
        }, this);
      } else {
        this.ready = true;
      }
    },
    update: function (f, h) {
      var g = this.ready;
      this.unload();
      var e = c.$new("a", { href: f });
      if (true !== h && this.self.src.has(e.href) && 0 !== this.self.width) {
        this.ready = g;
      } else {
        this.z11(true);
        this.self.src = f;
      }
      e = null;
    },
    z13: function () {
      this.naturalWidth = this.self.naturalWidth || this.self.width;
      this.naturalHeight = this.self.naturalHeight || this.self.height;
      this.width = this.self.width;
      this.height = this.self.height;
      if (this.width == 0 && this.height == 0 && c.j21.webkit) {
        this.width = this.self.naturalWidth;
        this.height = this.self.naturalHeight;
      }
      $mjs(["Left", "Right", "Top", "Bottom"]).j14(function (f) {
        this.padding[f.toLowerCase()] = this.self.j19("padding" + f).j17();
        this.border[f.toLowerCase()] = this.self
          .j19("border" + f + "Width")
          .j17();
      }, this);
      if (c.j21.presto || (c.j21.trident && !c.j21.backCompat)) {
        this.width -= this.padding.left + this.padding.right;
        this.height -= this.padding.top + this.padding.bottom;
      }
    },
    getBox: function () {
      var e = null;
      e = this.self.j9();
      return {
        top: e.top + this.border.top,
        bottom: e.bottom - this.border.bottom,
        left: e.left + this.border.left,
        right: e.right - this.border.right,
      };
    },
    z12: function () {
      if (this.z10) {
        this.z10.src = this.self.src;
        this.self = null;
        this.self = this.z10;
      }
    },
    load: function (e) {
      if (this.ready) {
        if (!this.width) {
          (function () {
            this.z13();
            this._cleanup();
            e.call();
          }
            .j24(this)
            .j27(1));
        } else {
          this._cleanup();
          e.call();
        }
      } else {
        if (!this.z9) {
          e.call(this, false);
          return;
        }
        this.cb = e;
      }
    },
    unload: function () {
      if (this.z9) {
        this.self.je2("load", this.z9);
      }
      $mjs(["abort", "error"]).j14(function (e) {
        this.self.je2(e, this.onErrorHandler);
      }, this);
      this.z9 = null;
      this.cb = null;
      this.width = null;
      this.ready = false;
      this._new = false;
    },
  };
  a.zoom = function () {
    this.construct.apply(this, arguments);
  };
  a.zoom.prototype = {
    construct: function (h, f, g) {
      var e = {};
      this.z28 = -1;
      this.z30 = false;
      this.ddx = 0;
      this.ddy = 0;
      this.firstRun = !this.z47;
      this.exOptions = this.firstRun ? {} : this.exOptions || {};
      this.activatedEx = false;
      this.z44 = null;
      this.z1Holder =
        $mjs(window).j29("magiczoom:holder") ||
        $mjs(window).j29(
          "magiczoom:holder",
          c
            .$new("div")
            .j6({
              position: "absolute",
              top: -10000,
              width: 10,
              height: 10,
              overflow: "hidden",
            })
            .j32(c.body)
        );
      this.options = c.detach(a.defaults);
      if (h) {
        this.c = $mjs(h);
      }
      this.divTag = "div" == this.c.tagName.toLowerCase();
      e = c.extend(e, this.z37());
      e = c.extend(e, this.z37(this.c.rel));
      e = c.extend(e, this.exOptions);
      if (f) {
        e = c.extend(
          e,
          c.extend(true === g ? this.exOptions : {}, this.z37(f))
        );
      }
      if (e.dragMode && !e.clickToActivate && undefined === e.alwaysShowZoom) {
        e.alwaysShowZoom = true;
      }
      c.extend(this.options, e);
      this.options.hotspots += "";
      if (
        "load" == this.options.initializeOn &&
        c.defined(this.options.clickToInitialize) &&
        "true" == this.options.clickToInitialize.toString()
      ) {
        this.options.initializeOn = "click";
      }
      if (
        c.defined(this.options.thumbChange) &&
        this.options.thumbChange != this.options.selectorsChange
      ) {
        this.options.selectorsChange = this.options.thumbChange;
      }
      if (this.firstRun && !this.divTag) {
        this.id = this.originId = this.c.id || "";
        if (!this.c.id) {
          this.c.id = this.id = "zoom-" + Math.floor(Math.random() * c.now());
        }
      }
      if ("inner" == this.options.zoomPosition && this.options.dragMode) {
        this.options.moveOnClick = true;
      }
      if (this.options.disableZoom) {
        this.z30 = false;
        this.options.clickToActivate = true;
        this.options.hint = false;
      }
      "string" === c.j1(this.options.onready) &&
        "function" === c.j1(window[this.options.onready]) &&
        (this.options.onready = window[this.options.onready]);
      if (h) {
        this.lastSelector = null;
        this.z14 = this.mousedown.j16(this);
        this.z15 = this.mouseup.j16(this);
        this.z16 = this.show.j24(this, true);
        this.z17 = this.z29.j24(this);
        this.z43Bind = this.z43.j16(this);
        this.resizeBind = function (k) {
          var j = $mjs(this.c).j29("magiczoom:window:size"),
            i = $mjs(window).j7();
          if (j.width !== i.width || j.height !== i.height) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = this.onresize.j24(this).j27(10);
            $mjs(this.c).j30("magiczoom:window:size", i);
          }
        }.j16(this);
        if (!this.divTag) {
          this.c.je1("click", function (j) {
            var i = j.getButton();
            if (3 == i) {
              return true;
            }
            $mjs(j).stop();
            if (!c.j21.trident) {
              this.blur();
            }
            return false;
          });
        }
        this.c.je1("mousedown", this.z14);
        this.c.je1("mouseup", this.z15);
        if ("mouseover" == this.options.initializeOn) {
          this.c.je1("mouseover", this.z14);
        }
        if (c.j21.touchScreen) {
          this.c.j6({
            "-webkit-user-select": "none",
            "-webkit-touch-callout": "none",
            "-webkit-tap-highlight-color": "transparent",
          });
          if (!this.options.disableZoom) {
            this.c.je1("touchstart", this.z14);
            this.c.je1("touchend", this.z15);
          } else {
            this.c.je1("click", function (i) {
              i.preventDefault();
            });
          }
        }
        this.c.unselectable = "on";
        this.c.style.MozUserSelect = "none";
        this.c.je1("selectstart", c.$Ff);
        if (!this.divTag) {
          this.c.j6({
            position: "relative",
            display: c.j21.gecko181 ? "block" : "inline-block",
            textDecoration: "none",
            outline: "0",
            cursor: "hand",
            overflow: "hidden",
          });
          if (c.j21.ieMode) {
            this.c.j2("magic-for-ie" + c.j21.ieMode);
          }
          if (this.c.j5("textAlign") == "center") {
            this.c.j6({ margin: "auto auto" });
          }
        }
        this.c.zoom = this;
      } else {
        this.options.initializeOn = "load";
      }
      if (!this.options.rightClick) {
        this.c.je1("contextmenu", c.$Ff);
      }
      if ("load" == this.options.initializeOn) {
        this.z18();
      } else {
        if ("" !== this.originId) {
          this.z26(true);
        }
      }
    },
    z18: function () {
      var j, m, l, k, h;
      if (!this.z7) {
        this.z7 = new a.z48(this.c.firstChild);
        this.z1 = new a.z48(this.c.href);
      } else {
        this.z1.update(this.c.href);
      }
      if (!this.z47) {
        this.z47 = {
          self: $mjs(document.createElement("DIV"))
            [this.divTag ? "j3" : "j2"]("MagicZoomBigImageCont")
            .j6({
              overflow: "hidden",
              zIndex: this.options.zoomPosition == "inner" ? 100 : 10002,
              top: "-100000px",
              position: "absolute",
              width: this.options.zoomWidth + "px",
              height: this.options.zoomHeight + "px",
            }),
          zoom: this,
          z21: "0px",
          lastLeftPos: "0px",
          initTopPos: 0,
          initLeftPos: 0,
          adjustX: { edge: "left", ratio: 1 },
          adjustY: { edge: "top", ratio: 1 },
          custom: false,
          initWidth: this.options.zoomWidth,
          initHeight: this.options.zoomHeight,
        };
        if (!(c.j21.trident900 && c.j21.ieMode < 9)) {
          switch (this.options.zoomWindowEffect) {
            case "shadow":
              this.z47.self.j2("MagicBoxShadow");
              break;
            case "glow":
              this.z47.self.j2("MagicBoxGlow");
              break;
            default:
              break;
          }
        }
        this.z47.hide = function () {
          if (
            this.self.style.top != "-100000px" &&
            this.zoom.z4 &&
            !this.zoom.z4.z38
          ) {
            this.self.style.top = "-100000px";
          }
          if (this.self.parentNode === c.body) {
            this.self.j32(this.zoom.z1Holder);
          }
        };
        this.z47.z22 = this.z47.hide.j24(this.z47);
        if (c.j21.trident4) {
          j = $mjs(document.createElement("IFRAME"));
          j.src = "javascript:''";
          j.j6({
            left: "0px",
            top: "0px",
            position: "absolute",
            "z-index": -1,
          }).frameBorder = 0;
          this.z47.z23 = this.z47.self.appendChild(j);
        }
        this.z47.z41 = $mjs(document.createElement("DIV"))
          .j2("MagicZoomHeader")
          .j6({
            position: "relative",
            zIndex: 10,
            left: "0px",
            top: "0px",
            padding: "3px",
          })
          .hide();
        m = c.$new("DIV", {}, { overflow: "hidden" });
        m.appendChild(this.z1.self);
        this.z1.self.j6({
          padding: "0px",
          margin: "0px",
          border: "0px",
          width: "auto",
          height: "auto",
        });
        if (this.options.showTitle == "bottom") {
          this.z47.self.appendChild(m);
          this.z47.self.appendChild(this.z47.z41);
        } else {
          this.z47.self.appendChild(this.z47.z41);
          this.z47.self.appendChild(m);
        }
        this.z47.self.j32(this.z1Holder);
        if ("undefined" !== typeof h) {
          this.z47.g = $mjs(document.createElement("div"))
            .j6({
              color: h[1],
              fontSize: h[2] + "px",
              fontWeight: h[3],
              fontFamily: "Tahoma",
              position: "absolute",
              "z-index": 10 + ("" + (this.z1.self.j5("z-index") || 0)).j17(),
              width: h[5],
              textAlign: h[4],
              "line-height": "2em",
              left: "0px",
            })
            .changeContent(a.x7(h[0]))
            .j32(
              this.z47.self,
              (Math.floor(Math.random() * 101) + 1) % 2 ? "top" : "bottom"
            );
        }
      }
      this.z47.initWidth = this.options.zoomWidth;
      this.z47.initHeight = this.options.zoomHeight;
      this.z47.custom = false;
      if (
        this.options.showTitle != "false" &&
        this.options.showTitle != false
      ) {
        var i = this.z47.z41;
        i.hide();
        while ((l = i.firstChild)) {
          i.removeChild(l);
        }
        if (this.options.titleSource == "title" && "" != this.c.title) {
          i.appendChild(document.createTextNode(this.c.title));
          i.show();
        } else {
          if (this.options.titleSource.has("#")) {
            var n = this.options.titleSource.replace(/^#/, "");
            if ($mjs(n)) {
              i.changeContent($mjs(n).innerHTML);
              i.show();
            }
          }
        }
      } else {
        this.z47.z41.hide();
      }
      this.c.z46 = this.c.title;
      this.c.title = "";
      this.z7.load(this.z19.j24(this));
    },
    z19: function (e) {
      if (!e && e !== undefined) {
        return;
      }
      if (!this.z7) {
        return;
      }
      if (!this.options.opacityReverse) {
        this.z7.self.j23(1);
      }
      if (!this.divTag) {
        this.c.j6({ width: "auto", height: "auto" });
      }
      if (this.options.showLoading && !this.options.disableZoom) {
        this.z24 = setTimeout(this.z17, 400);
      }
      if (this.options.hotspots != "" && $mjs(this.options.hotspots)) {
        this.z25();
      }
      if (this.c.id != "") {
        this.z26();
      }
      this.z1.load(this.z20.j24(this));
    },
    z20: function (h) {
      var g, f, i, e;
      if (!h && h !== undefined) {
        clearTimeout(this.z24);
        if (this.options.showLoading && this.z3) {
          this.z3.hide();
        }
        this.z28 = c.now();
        return;
      }
      if (!this.z7 || !this.z1) {
        return;
      }
      f = this.z7.self.j9();
      this.z7Rect = f;
      if (f.bottom == f.top) {
        this.z20.j24(this).j27(500);
        return;
      }
      i =
        "custom" == this.options.zoomPosition
          ? this.c.id + "-big"
          : this.options.zoomPosition.has("#")
          ? this.options.zoomPosition.replace(/^#/, "")
          : null;
      if (i && $mjs(i)) {
        this.z47.custom = true;
        $mjs(i).appendChild(this.z47.self);
      } else {
        if ("inner" == this.options.zoomPosition) {
          this.c.appendChild(this.z47.self);
        }
      }
      if (this.z7.width == 0 && c.j21.trident) {
        this.z7.z13();
        this.z1.z13();
        !this.divTag && this.c.j6({ width: this.z7.width + "px" });
      }
      g = this.z47.z41.j7();
      if (/%$/i.test(this.options.zoomWidth)) {
        this.options.zoomWidth =
          (parseInt(this.options.zoomWidth) / 100) * this.z7.width;
      }
      if (/%$/i.test(this.options.zoomHeight)) {
        this.options.zoomHeight =
          (parseInt(this.options.zoomHeight) / 100) * this.z7.height;
      }
      this.z47.self.j6({ width: this.options.zoomWidth });
      g = this.z47.z41.j7();
      if (this.options.fitZoomWindow || this.options.entireImage) {
        if (
          this.z1.width < this.options.zoomWidth ||
          this.options.entireImage
        ) {
          this.options.zoomWidth = this.z1.width;
          this.z47.self.j6({ width: this.options.zoomWidth });
          g = this.z47.z41.j7();
        }
        if (
          this.z1.height < this.options.zoomHeight ||
          this.options.entireImage
        ) {
          this.options.zoomHeight = this.z1.height + g.height;
        }
      }
      switch (this.options.zoomPosition) {
        case "right":
          this.z47.self.style.left = f.right + this.options.zoomDistance + "px";
          this.z47.adjustX.edge = "right";
          break;
        case "left":
          this.z47.self.style.left =
            f.left - this.options.zoomDistance - this.options.zoomWidth + "px";
          break;
        case "top":
          this.z47.z21 =
            f.top -
            (this.options.zoomDistance + this.options.zoomHeight) +
            "px";
          break;
        case "bottom":
          this.z47.z21 = f.bottom + this.options.zoomDistance + "px";
          this.z47.adjustY.edge = "bottom";
          break;
        case "inner":
          this.z47.self.j6({ left: "0px", height: "100%", width: "100%" });
          this.options.zoomWidth = this.z7.width;
          this.options.zoomHeight = this.z7.height;
          this.z47.z21 = "0px";
          g = this.z47.z41.j7();
          break;
        default:
          if (this.z47.custom) {
            e = $mjs(this.z47.self.parentNode).j7();
            if (/%$/i.test(this.z47.initWidth)) {
              this.options.zoomWidth =
                (parseInt(this.z47.initWidth) / 100) * e.width;
            }
            if (/%$/i.test(this.z47.initHeight)) {
              this.options.zoomHeight =
                (parseInt(this.z47.initHeight) / 100) * e.height;
            }
            this.z47.self.j6({ left: "0px", width: this.options.zoomWidth });
            this.z47.z21 = "0px";
            g = this.z47.z41.j7();
          }
          break;
      }
      if (this.options.showTitle == "bottom") {
        $mjs(this.z1.self.parentNode).j6Prop(
          "height",
          this.options.zoomHeight - g.height
        );
      }
      this.z47.self
        .j6(
          "inner" == this.options.zoomPosition
            ? {}
            : {
                height: this.options.zoomHeight + "px",
                width: this.options.zoomWidth + "px",
              }
        )
        .j23(1);
      if (c.j21.trident4 && this.z47.z23) {
        this.z47.z23.j6({
          width: this.options.zoomWidth + "px",
          height: this.options.zoomHeight + "px",
        });
      }
      if (
        this.options.zoomPosition == "right" ||
        this.options.zoomPosition == "left"
      ) {
        if (this.options.zoomAlign == "center") {
          this.z47.z21 =
            f.bottom -
            (f.bottom - f.top) / 2 -
            this.options.zoomHeight / 2 +
            "px";
          this.z47.adjustY = { edge: "bottom", ratio: 2 };
        } else {
          if (this.options.zoomAlign == "bottom") {
            this.z47.z21 = f.bottom - this.options.zoomHeight + "px";
            this.z47.adjustY.edge = "bottom";
          } else {
            this.z47.z21 = f.top + "px";
          }
        }
      } else {
        if (
          this.options.zoomPosition == "top" ||
          this.options.zoomPosition == "bottom"
        ) {
          if (this.options.zoomAlign == "center") {
            this.z47.self.style.left =
              f.right -
              (f.right - f.left) / 2 -
              this.options.zoomWidth / 2 +
              "px";
            this.z47.adjustX = { edge: "right", ratio: 2 };
          } else {
            if (this.options.zoomAlign == "right") {
              this.z47.self.style.left =
                f.right - this.options.zoomWidth + "px";
              this.z47.adjustX.edge = "right";
            } else {
              this.z47.self.style.left = f.left + "px";
            }
          }
        }
      }
      this.z47.initTopPos = parseInt(this.z47.z21, 10);
      this.z47.initLeftPos = parseInt(this.z47.self.style.left, 10);
      this.z47.lastLeftPos = this.z47.initLeftPos;
      this.z47.z21 = this.z47.initTopPos;
      this.zoomViewHeight = this.options.zoomHeight - g.height;
      if (this.z47.g) {
        this.z47.g.j6({
          top: this.options.showTitle == "bottom" ? 0 : "auto",
          bottom: this.options.showTitle == "bottom" ? "auto" : 0,
        });
      }
      this.z1.self.j6({
        position: "relative",
        borderWidth: "0px",
        padding: "0px",
        left: "0px",
        top: "0px",
      });
      this.z27();
      if (this.options.alwaysShowZoom) {
        if (this.options.x == -1) {
          this.options.x = this.z7.width / 2;
        }
        if (this.options.y == -1) {
          this.options.y = this.z7.height / 2;
        }
        this.show();
      } else {
        if (this.options.zoomFade) {
          this.z2 = new c.FX(this.z47.self, {
            forceAnimation: "ios" === c.j21.platform,
          });
        }
        this.z47.self.j6({ top: "-100000px" });
      }
      if (this.options.showLoading && this.z3) {
        this.z3.hide();
      }
      this.c.je1("mousemove", this.z43Bind);
      this.c.je1("mouseout", this.z43Bind);
      if (c.j21.touchScreen) {
        this.c.je1("touchstart", this.z43Bind);
        this.c.je1("touchmove", this.z43Bind);
        this.c.je1("touchend", this.z43Bind);
      }
      this.setupHint();
      $mjs(this.c).j29("magiczoom:window:size", $mjs(window).j7());
      $mjs(window).je1("resize", this.resizeBind);
      if (
        !this.options.disableZoom &&
        (!this.options.clickToActivate || "click" == this.options.initializeOn)
      ) {
        this.z30 = true;
      }
      if ("click" == this.options.initializeOn && this.initMouseEvent) {
        this.z43(this.initMouseEvent);
      }
      if (this.activatedEx) {
        this.activate();
      }
      this.z28 = c.now();
      !this.divTag &&
        "function" == c.j1(this.options.onready) &&
        this.options.onready.call(null, this.id, !this.firstRun);
    },
    setupHint: function () {
      var i = /tr|br/i,
        e = /bl|br|bc/i,
        f = /bc|tc/i,
        h = null;
      this.hintVisible = undefined;
      if (!this.options.hint) {
        if (this.hint) {
          this.hint.kill();
          this.hint = undefined;
        }
        return;
      }
      if (!this.hint) {
        this.hint = $mjs(document.createElement("DIV"))
          .j2(this.options.hintClass)
          .j6({
            display: "block",
            overflow: "hidden",
            position: "absolute",
            visibility: "hidden",
            "z-index": 1,
          });
        if (this.options.hintText != "") {
          this.hint.appendChild(document.createTextNode(this.options.hintText));
        }
        this.c.appendChild(this.hint);
      } else {
        if (this.options.hintText != "") {
          h = this.hint[this.hint.firstChild ? "replaceChild" : "appendChild"](
            document.createTextNode(this.options.hintText),
            this.hint.firstChild
          );
          h = null;
        }
      }
      this.hint.j6({
        left: "auto",
        right: "auto",
        top: "auto",
        bottom: "auto",
        display: "block",
        opacity: this.options.hintOpacity / 100,
        "max-width": this.z7.width - 4,
      });
      var g = this.hint.j7();
      this.hint
        .j6Prop(
          i.test(this.options.hintPosition) ? "right" : "left",
          f.test(this.options.hintPosition) ? (this.z7.width - g.width) / 2 : 2
        )
        .j6Prop(e.test(this.options.hintPosition) ? "bottom" : "top", 2);
      this.hintVisible = true;
      this.hint.show();
    },
    z29: function () {
      if (this.z1.ready) {
        return;
      }
      this.z3 = $mjs(document.createElement("DIV"))
        .j2(this.options.loadingClass)
        .j23(this.options.loadingOpacity / 100)
        .j6({
          display: "block",
          overflow: "hidden",
          position: "absolute",
          visibility: "hidden",
          "z-index": 20,
          "max-width": this.z7.width - 4,
        });
      this.z3.appendChild(document.createTextNode(this.options.loadingMsg));
      this.c.appendChild(this.z3);
      var e = this.z3.j7();
      this.z3.j6({
        left:
          (this.options.loadingPositionX == -1
            ? (this.z7.width - e.width) / 2
            : this.options.loadingPositionX) + "px",
        top:
          (this.options.loadingPositionY == -1
            ? (this.z7.height - e.height) / 2
            : this.options.loadingPositionY) + "px",
      });
      this.z3.show();
    },
    z26: function (g) {
      var e,
        h,
        f = new RegExp("zoom\\-id(\\s+)?:(\\s+)?" + this.c.id + "($|;)");
      this.selectors = $mjs([]);
      c.$A(document.getElementsByTagName("A")).j14(function (j) {
        if (f.test(j.rel)) {
          if (!$mjs(j).z36) {
            j.z36 = function (k) {
              if (!c.j21.trident) {
                this.blur();
              }
              $mjs(k).stop();
              return false;
            };
            j.je1("click", j.z36);
          }
          if (g) {
            if (
              ("mouseover" == this.options.initializeOn ||
                "click" == this.options.initializeOn) &&
              !$mjs(j).clickInitZoom
            ) {
              j.clickInitZoom = function (l, k) {
                k.je2("click", k.clickInitZoom);
                if (!!this.z7) {
                  return;
                }
                $mjs(l).stop();
                this.c.href = k.href;
                this.c.firstChild.src = k.rev;
                this.start(k.rel);
              }.j16(this, j);
              j.je1("click", j.clickInitZoom);
            }
            return;
          }
          var i = c.$new("a", { href: j.rev });
          this.options.selectorsClass != "" &&
            $mjs(j)[
              this.z1.self.src.has(j.href) && this.z7.self.src.has(i.href)
                ? "j2"
                : "j3"
            ](this.options.selectorsClass);
          if (this.z1.self.src.has(j.href) && this.z7.self.src.has(i.href)) {
            this.lastSelector = j;
          }
          i = null;
          if (!j.z34) {
            j.z34 = function (m, l) {
              l = m.currentTarget || m.getTarget();
              try {
                while ("a" != l.tagName.toLowerCase()) {
                  l = l.parentNode;
                }
              } catch (k) {
                return;
              }
              if (l.hasChild(m.getRelated())) {
                return;
              }
              if (m.type == "mouseout") {
                if (this.z35) {
                  clearTimeout(this.z35);
                }
                this.z35 = false;
                return;
              }
              if (l.title != "") {
                this.c.title = l.title;
              }
              if (m.type == "mouseover") {
                this.z35 = setTimeout(
                  this.update.j24(this, l.href, l.rev, l.rel, l),
                  this.options.selectorsMouseoverDelay
                );
              } else {
                this.update(l.href, l.rev, l.rel, l);
              }
            }.j16(this);
            j.je1(this.options.selectorsChange, j.z34);
            if (this.options.selectorsChange == "mouseover") {
              j.je1("mouseout", j.z34);
            }
          }
          j.j6({ outline: "0", display: "inline-block" });
          if (this.options.preloadSelectorsSmall) {
            h = new Image();
            h.src = j.rev;
          }
          if (this.options.preloadSelectorsBig) {
            e = new Image();
            e.src = j.href;
          }
          this.selectors.push(j);
        }
      }, this);
    },
    stop: function (f) {
      try {
        this.pause();
        this.c.je2("mousemove", this.z43Bind);
        this.c.je2("mouseout", this.z43Bind);
        if (c.j21.touchScreen) {
          this.c.je2("touchmove", this.z43Bind);
          this.c.je2("touchend", this.z43Bind);
        }
        if (undefined === f && this.z4) {
          this.z4.self.hide();
        }
        if (this.z2) {
          this.z2.stop();
        }
        this.z6 = null;
        this.z30 = false;
        if (this.selectors !== undefined) {
          this.selectors.j14(function (e) {
            if (this.options.selectorsClass != "") {
              e.j3(this.options.selectorsClass);
            }
            if (undefined === f) {
              e.je2(this.options.selectorsChange, e.z34);
              if (this.options.selectorsChange == "mouseover") {
                e.je2("mouseout", e.z34);
              }
              e.z34 = null;
              e.je2("click", e.z36);
              e.z36 = null;
            }
          }, this);
        }
        if (this.options.hotspots != "" && $mjs(this.options.hotspots)) {
          $mjs(this.options.hotspots).hide();
          $mjs(this.options.hotspots).z31.insertBefore(
            $mjs(this.options.hotspots),
            $mjs(this.options.hotspots).z32
          );
          if (this.c.z33) {
            this.c.removeChild(this.c.z33);
          }
        }
        if (this.options.opacityReverse) {
          this.c.j3("MagicZoomPup");
          this.z7.self.j23(1);
        }
        this.z2 = null;
        if (this.z3) {
          this.c.removeChild(this.z3);
        }
        if (this.hint) {
          this.hint.hide();
        }
        if (undefined === f) {
          if (this.hint) {
            this.c.removeChild(this.hint);
          }
          this.hint = null;
          this.z1.unload();
          this.z7.unload();
          this.z4 && this.z4.self && this.c.removeChild(this.z4.self);
          this.z47 &&
            this.z47.self &&
            this.z47.self.parentNode.removeChild(this.z47.self);
          this.z4 = null;
          this.z47 = null;
          this.z1 = null;
          this.z7 = null;
          if (!this.options.rightClick) {
            this.c.je2("contextmenu", c.$Ff);
          }
          if ("" === this.originId) {
            this.c.removeAttribute("id");
          } else {
            this.c.id = this.originId;
          }
          $mjs(window).je2("resize", this.resizeBind);
        }
        if (this.z24) {
          clearTimeout(this.z24);
          this.z24 = null;
        }
        this.z44 = null;
        this.c.z33 = null;
        this.z3 = null;
        if (this.c.title == "") {
          this.c.title = this.c.z46;
        }
        this.z28 = -1;
      } catch (g) {}
    },
    start: function (f, e) {
      if (this.z28 != -1) {
        return;
      }
      this.construct(false, f, null === e || undefined === e);
    },
    update: function (w, l, f, v) {
      var g,
        z,
        e,
        i,
        q,
        h,
        B = null,
        s = null,
        j = this.lastSelector,
        k,
        m,
        y,
        r,
        o,
        p,
        C,
        A,
        n;
      v = v || null;
      if (c.now() - this.z28 < 300 || this.z28 == -1 || this.ufx) {
        this.z35 && clearTimeout(this.z35);
        g = 300 - c.now() + this.z28;
        if (this.z28 == -1) {
          g = 300;
        }
        this.z35 = setTimeout(this.update.j24(this, w, l, f, v), g);
        return;
      }
      if (v && this.lastSelector == v) {
        return;
      } else {
        this.lastSelector = v;
      }
      z = function (D) {
        if (undefined != w) {
          this.c.href = w;
        }
        if (undefined === f) {
          f = "";
        }
        if (this.options.preservePosition) {
          f = "x: " + this.options.x + "; y: " + this.options.y + "; " + f;
        }
        if (undefined != l) {
          this.z7.update(l);
        }
        if (D !== undefined) {
          this.z7.load(D);
        }
      };
      this.z7.z13();
      i = this.z7.width;
      q = this.z7.height;
      this.stop(true);
      if (this.options.selectorsEffect != "false" && undefined !== l) {
        this.ufx = true;
        var x = $mjs(this.c.cloneNode(true)).j6({
          position: "absolute",
          top: 0,
          left: 0,
          width: "",
        });
        var u = c
          .$new("div", {
            id: this.c.parentNode.id,
            class: this.c.parentNode.className,
          })
          .j2("mz-tmp-clone")
          .j6({
            width: $mjs(this.c.parentNode).j5("width"),
            "max-width": $mjs(this.c.parentNode).j5("max-width"),
          });
        if ("td" === this.c.parentNode.tagName.toLocaleLowerCase()) {
          this.c.parentNode.insertBefore(u, this.c);
        } else {
          this.c.parentNode.parentNode.insertBefore(u, this.c.parentNode);
        }
        u.append(x);
        c.j21.chrome && u.j7();
        if (c.j21.ieMode && c.j21.ieMode < 8) {
          $mjs(x.firstChild).j23(1);
        }
        h = new a.z48(x.firstChild);
        h.update(l);
        if ("pounce" == this.options.selectorsEffect) {
          n = this.c.href;
          k = this.selectors.filter(function (D) {
            return D.href.has(n);
          });
          k = k[0] ? $mjs(k[0].byTag("img")[0] || k[0]) : this.z7.self;
          m = this.selectors.filter(function (D) {
            return D.href.has(w);
          });
          m = m[0] ? $mjs(m[0].byTag("img")[0] || m[0]) : null;
          if (null == m) {
            m = this.z7.self;
            k = this.z7.self;
          }
          (r = this.z7.self.j8()),
            (o = k.j8()),
            (p = m.j8()),
            (A = k.j7()),
            (C = m.j7());
        }
        e = function (F) {
          var D = {},
            H = {},
            G = {},
            I = null,
            E = null;
          if (false === F) {
            h.unload();
            $mjs(h.self).j33();
            h = null;
            u.j33();
            this.ufx = false;
            if (s) {
              s.state = "inz30";
            }
            this.lastSelector = j;
            this.start(null, j);
            return;
          }
          if (
            c.j21.ieMode &&
            c.j21.ieMode < 8 &&
            (i === h.width || 0 === h.width)
          ) {
            h.self.j6Prop("zoom", 1);
            u.j7();
            h.z13();
          }
          if ("pounce" == this.options.selectorsEffect) {
            D.width = [i, A.width];
            D.height = [q, A.height];
            D.top = [r.top, o.top];
            D.left = [r.left, o.left];
            H.width = [C.width, h.width];
            H.height = [C.height, h.height];
            H.top = [p.top, r.top];
            u.j6({ padding: "" });
            x.j23(0).j6({ height: 0, width: h.width, position: "relative" });
            H.left = [p.left, x.j8().left];
            G.width = [i, h.width];
            h.self
              .j32(c.body)
              .j6({
                position: "absolute",
                "z-index": 5001,
                left: H.left[0],
                top: H.top[0],
                width: H.width[0],
                height: H.height[0],
              });
            I = $mjs(this.c.firstChild.cloneNode(false))
              .j32(c.body)
              .j6({
                position: "absolute",
                "z-index": 5000,
                left: D.left[0],
                top: D.top[0],
                visibility: "visible",
              });
            $mjs(this.c.firstChild).j6({ visibility: "hidden" });
            u.j33();
            E = this.c.j5("border-width");
            this.c.j6Prop("border-width", 0);
          } else {
            h.self
              .j32(this.c)
              .j6({
                position: "absolute",
                "z-index": 5001,
                opacity: 0,
                left: "0px",
                top: "0px",
                height: "auto",
              });
            I = $mjs(this.c.firstChild.cloneNode(false))
              .j32(this.c)
              .j6({
                position: "absolute",
                "z-index": 5000,
                left: "0px",
                top: "0px",
                visibility: "visible",
                height: "auto",
              });
            $mjs(this.c.firstChild).j6({ visibility: "hidden" });
            u.j33();
            H = { opacity: [0, 1] };
            if (i != h.width || q != h.height) {
              G.width = H.width = D.width = [i, h.width];
              G.height = H.height = D.height = [q, h.height];
            }
            if (this.options.selectorsEffect == "fade") {
              D.opacity = [1, 0];
            }
          }
          new c.PFX([this.c, h.self, I || this.c.firstChild], {
            duration: this.options.selectorsEffectSpeed,
            onComplete: function () {
              if (I) {
                I.j33();
                I = null;
              }
              if (null !== E) {
                this.c.j6Prop("border-width", E);
              }
              z.call(
                this,
                function () {
                  h.unload();
                  $mjs(this.c.firstChild).j6({ visibility: "visible" });
                  $mjs(h.self).j33();
                  h = null;
                  if (D.opacity) {
                    $mjs(this.c.firstChild).j6({ opacity: 1 });
                  }
                  this.ufx = false;
                  this.start(f, v);
                  if (B) {
                    B.j27(10);
                  }
                }.j24(this)
              );
            }.j24(this),
          }).start([G, H, D]);
        };
        h.load(e.j24(this));
      } else {
        z.call(
          this,
          function () {
            this.c.j6({
              width: this.z7.width + "px",
              height: this.z7.height + "px",
            });
            this.start(f, v);
            if (B) {
              B.j27(10);
            }
          }.j24(this)
        );
      }
    },
    z37: function (f) {
      var e, j, h, g;
      e = null;
      j = [];
      f = f || "";
      if ("" == f) {
        for (g in a.options) {
          e = a.options[g];
          switch (c.j1(a.defaults[g.j22()])) {
            case "boolean":
              e = e.toString().j18();
              break;
            case "number":
              if (
                !("zoomWidth" === g.j22() || "zoomHeight" === g.j22()) ||
                !/\%$/i.test(e)
              ) {
                e = parseFloat(e);
              }
              break;
            default:
              break;
          }
          j[g.j22()] = e;
        }
      } else {
        h = $mjs(f.split(";"));
        h.j14(function (i) {
          a.z39.j14(function (k) {
            e = k.exec(i.j26());
            if (e) {
              switch (c.j1(a.defaults[e[1].j22()])) {
                case "boolean":
                  j[e[1].j22()] = e[4] === "true";
                  break;
                case "number":
                  j[e[1].j22()] =
                    ("zoomWidth" === e[1].j22() ||
                      "zoomHeight" === e[1].j22()) &&
                    /\%$/.test(e[4])
                      ? e[4]
                      : parseFloat(e[4]);
                  break;
                default:
                  j[e[1].j22()] = e[4];
              }
            }
          }, this);
        }, this);
      }
      if (false === j.selectorsEffect) {
        j.selectorsEffect = "false";
      }
      return j;
    },
    z27: function () {
      var f, e;
      if (!this.z4) {
        this.z4 = {
          self: $mjs(document.createElement("DIV"))
            .j2("MagicZoomPup")
            .j6({ zIndex: 10, position: "absolute", overflow: "hidden" })
            .hide(),
          width: 20,
          height: 20,
          bgColor: "",
        };
        this.c.appendChild(this.z4.self);
        this.z4.bgColor = this.z4.self.j5("background-color");
      }
      if (this.options.entireImage) {
        this.z4.self.j6({ "border-width": "0px", cursor: "default" });
      }
      this.z4.z38 = false;
      this.z4.height = this.zoomViewHeight / (this.z1.height / this.z7.height);
      this.z4.width = this.options.zoomWidth / (this.z1.width / this.z7.width);
      if (this.z4.width > this.z7.width) {
        this.z4.width = this.z7.width;
      }
      if (this.z4.height > this.z7.height) {
        this.z4.height = this.z7.height;
      }
      this.z4.width = Math.round(this.z4.width);
      this.z4.height = Math.round(this.z4.height);
      this.z4.borderWidth = this.z4.self.j19("borderLeftWidth").j17();
      this.z4.self.j6({
        width:
          this.z4.width -
          2 * (c.j21.backCompat ? 0 : this.z4.borderWidth) +
          "px",
        height:
          this.z4.height -
          2 * (c.j21.backCompat ? 0 : this.z4.borderWidth) +
          "px",
      });
      if (!this.options.opacityReverse && !this.options.rightClick) {
        this.z4.self.j23(parseFloat(this.options.opacity / 100));
        if (this.z4.z42) {
          this.z4.self.removeChild(this.z4.z42);
          this.z4.z42 = null;
        }
      } else {
        if (this.z4.z42) {
          this.z4.z42.src = this.z7.self.src;
        } else {
          f = this.z7.self.cloneNode(false);
          f.unselectable = "on";
          this.z4.z42 = $mjs(this.z4.self.appendChild(f)).j6({
            position: "absolute",
            zIndex: 5,
          });
        }
        if (this.options.opacityReverse) {
          this.z4.z42.j6(this.z7.self.j7());
          this.z4.self.j23(1);
          if (c.j21.ieMode && c.j21.ieMode < 9) {
            this.z4.z42.j23(1);
          }
        } else {
          if (this.options.rightClick) {
            this.z4.z42.j23(0.009);
          }
          this.z4.self.j23(parseFloat(this.options.opacity / 100));
        }
      }
    },
    z43: function (h, f) {
      if (!this.z30 || h === undefined || h.skipAnimation) {
        return false;
      }
      if (!this.z4) {
        return false;
      }
      var i = /touch/i.test(h.type) && h.touches.length > 1;
      var g = "touchend" == h.type && !h.continueAnimation;
      if ((!this.divTag || h.type != "mouseout") && !i) {
        $mjs(h).stop();
      }
      if (f === undefined) {
        f = $mjs(h).j15();
      }
      if (this.z6 === null || this.z6 === undefined) {
        this.z6 = this.z7.getBox();
      }
      if (
        g ||
        ("mouseout" == h.type && !this.c.hasChild(h.getRelated())) ||
        i ||
        f.x > this.z6.right ||
        f.x < this.z6.left ||
        f.y > this.z6.bottom ||
        f.y < this.z6.top
      ) {
        this.pause();
        return false;
      }
      this.activatedEx = false;
      if (h.type == "mouseout" || h.type == "touchend") {
        return false;
      }
      if (this.options.dragMode && !this.z45) {
        return false;
      }
      if (!this.options.moveOnClick) {
        f.x -= this.ddx;
        f.y -= this.ddy;
      }
      if (f.x + this.z4.width / 2 >= this.z6.right) {
        f.x = this.z6.right - this.z4.width / 2;
      }
      if (f.x - this.z4.width / 2 <= this.z6.left) {
        f.x = this.z6.left + this.z4.width / 2;
      }
      if (f.y + this.z4.height / 2 >= this.z6.bottom) {
        f.y = this.z6.bottom - this.z4.height / 2;
      }
      if (f.y - this.z4.height / 2 <= this.z6.top) {
        f.y = this.z6.top + this.z4.height / 2;
      }
      this.options.x = f.x - this.z6.left;
      this.options.y = f.y - this.z6.top;
      if (this.z44 === null) {
        this.z44 = setTimeout(this.z16, 10);
      }
      if (c.defined(this.hintVisible) && this.hintVisible) {
        this.hintVisible = false;
        this.hint.hide();
      }
      return true;
    },
    show: function (i) {
      if (i && !this.z44) {
        return;
      }
      var o,
        l,
        h,
        g,
        n,
        m,
        k,
        j,
        f,
        e = this.options,
        p = this.z4;
      o = p.width / 2;
      l = p.height / 2;
      p.self.style.left = e.x - o + this.z7.border.left + "px";
      p.self.style.top = e.y - l + this.z7.border.top + "px";
      if (this.options.opacityReverse) {
        p.z42.style.left =
          "-" + (parseFloat(p.self.style.left) + p.borderWidth) + "px";
        p.z42.style.top =
          "-" + (parseFloat(p.self.style.top) + p.borderWidth) + "px";
      }
      h = (this.options.x - o) * (this.z1.width / this.z7.width);
      g = (this.options.y - l) * (this.z1.height / this.z7.height);
      if (this.z1.width - h < e.zoomWidth) {
        h = this.z1.width - e.zoomWidth;
        if (h < 0) {
          h = 0;
        }
      }
      if (this.z1.height - g < this.zoomViewHeight) {
        g = this.z1.height - this.zoomViewHeight;
        if (g < 0) {
          g = 0;
        }
      }
      if (document.documentElement.dir == "rtl") {
        h =
          (e.x + p.width / 2 - this.z7.width) * (this.z1.width / this.z7.width);
      }
      h = Math.round(h);
      g = Math.round(g);
      if (e.smoothing === false || !p.z38) {
        this.z1.self.style.left = -h + "px";
        this.z1.self.style.top = -g + "px";
      } else {
        n = parseInt(this.z1.self.style.left);
        m = parseInt(this.z1.self.style.top);
        k = -h - n;
        j = -g - m;
        if (!k && !j) {
          this.z44 = null;
          return;
        }
        k *= e.smoothingSpeed / 100;
        if (k < 1 && k > 0) {
          k = 1;
        } else {
          if (k > -1 && k < 0) {
            k = -1;
          }
        }
        n += k;
        j *= e.smoothingSpeed / 100;
        if (j < 1 && j > 0) {
          j = 1;
        } else {
          if (j > -1 && j < 0) {
            j = -1;
          }
        }
        m += j;
        this.z1.self.style.left = n + "px";
        this.z1.self.style.top = m + "px";
      }
      if (!p.z38) {
        if (this.z2) {
          this.z2.stop();
          this.z2.options.onComplete = c.$F;
          this.z2.options.duration = e.zoomFadeInSpeed;
          this.z47.self.j23(0);
          this.z2.start({ opacity: [0, 1] });
        }
        if (/^(left|right|top|bottom)$/i.test(e.zoomPosition)) {
          this.z47.self.j32(c.body);
        }
        if (e.zoomPosition != "inner") {
          p.self.show();
        }
        this.z47.self.j6(
          this.adjustPosition(
            /^(left|right|top|bottom)$/i.test(e.zoomPosition) &&
              !this.options.alwaysShowZoom
          )
        );
        if (e.opacityReverse) {
          this.c.j6Prop("background-color", this.z4.bgColor);
          this.z7.self.j23(parseFloat((100 - e.opacity) / 100));
        }
        p.z38 = true;
      }
      if (this.z44) {
        this.z44 = setTimeout(this.z16, 1000 / e.fps);
      }
    },
    adjustPosition: function (m) {
      var f = this.getViewPort(5),
        e = this.z7.self.j9(),
        j = this.options.zoomPosition,
        i = this.z47,
        g = this.options.zoomDistance,
        n = i.self.j7(),
        l = i.initTopPos,
        h = i.initLeftPos,
        k = { left: i.initLeftPos, top: i.initTopPos };
      if ("inner" === j || this.z47.custom) {
        return k;
      }
      m || (m = false);
      i.lastLeftPos +=
        (e[i.adjustX.edge] - this.z7Rect[i.adjustX.edge]) / i.adjustX.ratio;
      i.z21 +=
        (e[i.adjustY.edge] - this.z7Rect[i.adjustY.edge]) / i.adjustY.ratio;
      this.z7Rect = e;
      k.left = h = i.lastLeftPos;
      k.top = l = i.z21;
      if (m) {
        if ("left" == j || "right" == j) {
          if ("left" == j && f.left > h) {
            k.left =
              e.left - f.left >= n.width
                ? e.left - n.width - 2
                : f.right - e.right - 2 > e.left - f.left - 2
                ? e.right + 2
                : e.left - n.width - 2;
          } else {
            if ("right" == j && f.right < h + n.width) {
              k.left =
                f.right - e.right >= n.width
                  ? e.right + 2
                  : e.left - f.left - 2 > f.right - e.right - 2
                  ? e.left - n.width - 2
                  : e.right + 2;
            }
          }
        } else {
          if ("top" == j || "bottom" == j) {
            k.left = Math.max(
              f.left + 2,
              Math.min(f.right, h + n.width) - n.width
            );
            if ("top" == j && f.top > l) {
              k.top =
                e.top - f.top >= n.height
                  ? e.top - n.height - 2
                  : f.bottom - e.bottom - 2 > e.top - f.top - 2
                  ? e.bottom + 2
                  : e.top - n.height - 2;
            } else {
              if ("bottom" == j && f.bottom < l + n.height) {
                k.top =
                  f.bottom - e.bottom >= n.height
                    ? e.bottom + 2
                    : e.top - f.top - 2 > f.bottom - e.bottom - 2
                    ? e.top - n.height - 2
                    : e.bottom + 2;
              }
            }
          }
        }
      }
      return k;
    },
    getViewPort: function (g) {
      g = g || 0;
      var f = c.j21.touchScreen
          ? { width: window.innerWidth, height: window.innerHeight }
          : $mjs(window).j7(),
        e = $mjs(window).j10();
      return {
        left: e.x + g,
        right: e.x + f.width - g,
        top: e.y + g,
        bottom: e.y + f.height - g,
      };
    },
    onresize: function (i) {
      if (!this.z7 || !this.z7.ready) {
        return;
      }
      var g,
        f,
        h = { width: this.z7.width, height: this.z7.height };
      this.z7.z13();
      if (this.z47.custom) {
        f = $mjs(this.z47.self.parentNode).j7();
        if (/%$/i.test(this.z47.initWidth)) {
          this.options.zoomWidth =
            (parseInt(this.z47.initWidth) / 100) * f.width;
        }
        if (/%$/i.test(this.z47.initHeight)) {
          this.options.zoomHeight =
            (parseInt(this.z47.initHeight) / 100) * f.height;
        }
      } else {
        if ("inner" === this.options.zoomPosition) {
          this.options.zoomWidth = this.z7.width;
          this.options.zoomHeight = this.z7.height;
        } else {
          this.options.zoomWidth *= this.z7.width / h.width;
          this.options.zoomHeight *= this.z7.height / h.height;
        }
      }
      g = this.z47.z41.j7();
      this.zoomViewHeight = this.options.zoomHeight - g.height;
      if (this.options.showTitle == "bottom") {
        $mjs(this.z1.self.parentNode).j6Prop(
          "height",
          this.options.zoomHeight - g.height
        );
      }
      this.z47.self.j6(
        "inner" == this.options.zoomPosition
          ? {}
          : {
              height: this.options.zoomHeight + "px",
              width: this.options.zoomWidth + "px",
            }
      );
      if (c.j21.trident4 && this.z47.z23) {
        this.z47.z23.j6({
          width: this.options.zoomWidth,
          height: this.options.zoomHeight,
        });
      }
      if (this.options.opacityReverse && this.z4.z42) {
        this.z4.z42.j6(this.z7.self.j7());
      }
      this.z4.height = this.zoomViewHeight / (this.z1.height / this.z7.height);
      this.z4.width = this.options.zoomWidth / (this.z1.width / this.z7.width);
      if (this.z4.width > this.z7.width) {
        this.z4.width = this.z7.width;
      }
      if (this.z4.height > this.z7.height) {
        this.z4.height = this.z7.height;
      }
      this.z4.width = Math.round(this.z4.width);
      this.z4.height = Math.round(this.z4.height);
      this.z4.borderWidth = this.z4.self.j19("borderLeftWidth").j17();
      this.z4.self.j6({
        width:
          this.z4.width -
          2 * (c.j21.backCompat ? 0 : this.z4.borderWidth) +
          "px",
        height:
          this.z4.height -
          2 * (c.j21.backCompat ? 0 : this.z4.borderWidth) +
          "px",
      });
      if (this.z4.z38) {
        this.z47.self.j6(
          this.adjustPosition(
            /^(left|right|top|bottom)$/i.test(this.options.zoomPosition) &&
              !this.options.alwaysShowZoom
          )
        );
        this.options.x *= this.z7.width / h.width;
        this.options.y *= this.z7.height / h.height;
        this.show();
      }
    },
    activate: function (f, g) {
      f = c.defined(f) ? f : true;
      this.activatedEx = true;
      if (!this.z1) {
        this.z18();
        return;
      }
      if (this.options.disableZoom) {
        return;
      }
      this.z30 = true;
      if (f) {
        if (c.defined(g)) {
          this.z43(g);
          return;
        }
        if (!this.options.preservePosition) {
          this.options.x = this.z7.width / 2;
          this.options.y = this.z7.height / 2;
        }
        this.show();
      }
    },
    pause: function () {
      var e = this.z4 && this.z4.z38;
      if (this.z44) {
        clearTimeout(this.z44);
        this.z44 = null;
      }
      if (!this.options.alwaysShowZoom && this.z4 && this.z4.z38) {
        this.z4.z38 = false;
        this.z4.self.hide();
        if (this.z2) {
          this.z2.stop();
          this.z2.options.onComplete = this.z47.z22;
          this.z2.options.duration = this.options.zoomFadeOutSpeed;
          var f = this.z47.self.j19("opacity");
          this.z2.start({ opacity: [f, 0] });
        } else {
          this.z47.hide();
        }
        if (this.options.opacityReverse) {
          this.c.j6Prop("background-color", "");
          this.z7.self.j23(1);
        }
      }
      this.z6 = null;
      if (this.options.clickToActivate) {
        this.z30 = false;
      }
      if (this.options.dragMode) {
        this.z45 = false;
      }
      if (this.hint) {
        this.hintVisible = true;
        this.hint.show();
      }
    },
    mousedown: function (i) {
      var f = i.getButton(),
        h = /touch/i.test(i.type),
        j = c.now();
      if (3 == f) {
        return true;
      }
      if (h) {
        if (i.targetTouches.length > 1) {
          return;
        }
        this.c.j30("magiczoom:event:lastTap", {
          id: i.targetTouches[0].identifier,
          x: i.targetTouches[0].clientX,
          y: i.targetTouches[0].clientY,
          ts: j,
        });
        if (this.z1 && this.z1.ready && !this.z30) {
          return;
        }
      }
      if (!(h && i.touches.length > 1)) {
        $mjs(i).stop();
      }
      if ("click" == this.options.initializeOn && !this.z7) {
        this.initMouseEvent = i;
        this.z18();
        return;
      }
      if (
        "mouseover" == this.options.initializeOn &&
        !this.z7 &&
        (i.type == "mouseover" || i.type == "touchstart")
      ) {
        this.initMouseEvent = i;
        this.z18();
        this.c.je2("mouseover", this.z14);
        return;
      }
      if (this.options.disableZoom) {
        return;
      }
      if (this.z7 && !this.z1.ready) {
        return;
      }
      if (this.z1 && this.options.clickToDeactivate && this.z30 && !h) {
        this.z30 = false;
        this.pause();
        return;
      }
      if (this.z1 && !this.z30) {
        this.activate(true, i);
        i.stopImmediatePropagation && i.stopImmediatePropagation();
      }
      if (this.z30 && this.options.dragMode) {
        this.z45 = true;
        if (!this.options.moveOnClick) {
          if (this.z6 === null || this.z6 === undefined) {
            this.z6 = this.z7.getBox();
          }
          var g = i.j15();
          this.ddx = g.x - this.options.x - this.z6.left;
          this.ddy = g.y - this.options.y - this.z6.top;
          if (
            Math.abs(this.ddx) > this.z4.width / 2 ||
            Math.abs(this.ddy) > this.z4.height / 2
          ) {
            this.z45 = false;
            return;
          }
        } else {
          this.z43(i);
        }
      }
    },
    mouseup: function (i) {
      var f = i.getButton(),
        h = /touch/i.test(i.type),
        k = c.now(),
        j = null,
        g = this.options.preservePosition;
      if (3 == f) {
        return true;
      }
      if (h) {
        j = this.c.j29("magiczoom:event:lastTap");
        if (!j || i.targetTouches.length > 1) {
          return;
        }
        if (
          j.id == i.changedTouches[0].identifier &&
          k - j.ts <= 200 &&
          Math.sqrt(
            Math.pow(i.changedTouches[0].clientX - j.x, 2) +
              Math.pow(i.changedTouches[0].clientY - j.y, 2)
          ) <= 15
        ) {
          if (this.z1 && this.z1.ready && !this.z30) {
            if (this.z6 === null || this.z6 === undefined) {
              this.z6 = this.z7.getBox();
            }
            this.options.preservePosition = true;
            this.options.x = i.j15().x - this.z6.left;
            this.options.y = i.j15().y - this.z6.top;
            this.activate(true);
            this.options.preservePosition = g;
            this.options.dragMode && (this.z45 = true);
            this.ddx = 0;
            this.ddy = 0;
            i.continueAnimation = true;
            i.zoomActivation = true;
            i.stopImmediatePropagation && i.stopImmediatePropagation();
          }
          $mjs(i).stop();
          return;
        }
      }
      $mjs(i).stop();
      if (this.options.dragMode) {
        this.z45 = false;
      }
    },
  };
  if (c.j21.trident) {
    try {
      document.execCommand("BackgroundImageCache", false, true);
    } catch (b) {}
  }
  $mjs(document).je1("domready", function () {
    c.insertCSS(
      ".mz-tmp-clone",
      "margin: 0 !important;border: 0 !important;padding: 0 !important;position: relative  !important;height: 0 !important;min-height: 0 !important;z-index: -1;opacity: 0;",
      "mz-css"
    );
    $mjs(document).je1("mousemove", a.z8);
    a.refresh();
  });
  return a;
})(magicJS);
