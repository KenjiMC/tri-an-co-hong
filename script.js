/* script.js — logic của trang "Gửi cô Hồng".
   Lời nhắn nằm riêng trong notes.js (phải nạp trước file này). */
(function () {
  var $ = function (i) {
    return document.getElementById(i);
  };
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ============================================================
     DANH SÁCH ẢNH / VIDEO  — [đường dẫn file, chú thích]
     Muốn thêm ảnh: bỏ file vào assets/images/ rồi thêm một dòng vào danh sách tương ứng.
     ============================================================ */

  /* Ảnh trên "Dây phơi kỷ niệm" */
  var PS = [
    ["./day-phoi-01.jpg", "Cô trong ngày sinh nhật đặc biệt"],
    ["./day-phoi-02.jpg", "Cô bên chiếc bảng 10 Địa"],
    ["./day-phoi-03.jpg", "Những khoảnh khắc đơn giản"],
    ["./day-phoi-04.jpg", "Những buổi sinh hoạt lớp vui vẻ"],
    ["./day-phoi-05.jpg", "Cô đi canh gác dữ dằn lắm đó 😬"],
  ];

  /* Ảnh trên "Bức tường ảnh" */
  var PW = [
    ["./tuong-anh-01.jpg", "Lớp bên cô trong ngày sinh nhật"],
    ["./tuong-anh-02.jpg", "Cả lớp trong ngày 20/10"],
    ["./tuong-anh-03.jpg", "Cả lớp cùng cô ở hành lang"],
    ["./tuong-anh-04.jpg", "Cả lớp trong ngày khai giảng"],
    ["./tuong-anh-05.jpg", "Lễ kỷ niệm ngày Nhà giáo"],
    ["./tuong-anh-06.jpg", "Cả lớp đứng nghiêm trong lớp học"],
    ["./tuong-anh-07.jpg", "Tiết mục của lớp"],
    ["./tuong-anh-08.jpg", "Toán ơi là Toán"],
    ["./tuong-anh-09.jpg", "Hai bạn thả tim quý cô lắm đó💗💗"],
    ["./tuong-anh-10.jpg", "Suỵt, im lặng nào🤫"],
    ["./tuong-anh-11.jpg", "Khoảnh khắc nhí nhố"],
    ["./tuong-anh-12.jpg", "Tạo dáng bên bức tường"],
    ["./tuong-anh-13.jpg", "Giấc ngủ giữa giờ🥱"],
  ];

  /* Video trên "Bức tường": [file video, ảnh bìa, chú thích] */
  var PV = [
    [
      "./video-01.mp4",
      "./video-01-poster.jpg",
      "Những khoảnh khắc trong ngày sinh nhật của cô",
    ],
    [
      "./video-02.mp4",
      "./video-02-poster.jpg",
      "Những ngày “chơi đùa” ngoài hành lang",
    ],
    [
      "./video-03.mp4",
      "./video-03-poster.jpg",
      "Chuẩn bị sinh nhật cô nè!",
    ],
  ];

  /* ---------- Tiêu đề chạy chữ ---------- */
  var full = "Gửi cô Hồng",
    t = $("t"),
    k = 0;
  if (reduce) {
    t.textContent = full;
    t.className = "";
  } else
    (function tick() {
      t.textContent = full.slice(0, ++k);
      if (k < full.length) setTimeout(tick, 85);
      else
        setTimeout(function () {
          t.className = "";
        }, 1800);
    })();

  /* ---------- Cánh hoa rơi ---------- */
  if (!reduce) {
    var P = $("petals");
    for (var i = 0; i < 22; i++) {
      var e = document.createElement("i");
      e.className = "petal";
      var s = 0.6 + Math.random() * 0.9;
      e.style.cssText =
        "left:" +
        Math.random() * 100 +
        "%;transform:scale(" +
        s +
        ");animation-duration:" +
        (9 + Math.random() * 10) +
        "s;animation-delay:-" +
        Math.random() * 18 +
        "s;--dx:" +
        (Math.random() * 160 - 80) +
        "px;--rot:" +
        (360 + Math.random() * 540) +
        "deg";
      P.appendChild(e);
    }
  }

  /* ---------- Khung ảnh / video (tạo, thêm, xóa, kéo thả) và nạp danh sách ảnh ---------- */
  var order = [],
    lbi = 0,
    cnt = 0;
  function slot(parent, string) {
    var f = document.createElement("figure");
    f.className = "pol";
    if (!string) f.style.setProperty("--r", ((cnt++ % 5) - 2) * 1.8 + "deg");
    var s = document.createElement("div");
    s.className = "slot";
    s.tabIndex = 0;
    s.setAttribute("role", "button");
    s.innerHTML = '<svg><use href="#cam"/></svg>Thêm ảnh hoặc video';
    var inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*,video/*";
    inp.hidden = true;
    var cap = document.createElement("div");
    cap.className = "cap";
    cap.contentEditable = "true";
    cap.spellcheck = false;
    cap.dataset.ph = "Viết vài chữ...";
    var x = document.createElement("button");
    x.type = "button";
    x.className = "x";
    x.textContent = "×";
    x.setAttribute("aria-label", "Xóa");
    f.append(s, cap, x, inp);
    parent.appendChild(f);
    function set(file) {
      if (!file) return;
      if (/^video\//.test(file.type)) {
        fillVid(URL.createObjectURL(file));
        return;
      }
      if (!/^image\//.test(file.type)) return;
      var r = new FileReader();
      r.onload = function () {
        fill(r.result);
      };
      r.readAsDataURL(file);
    }
    function fill(src) {
      clear();
      var im = document.createElement("img");
      im.src = src;
      im.alt = "Ảnh kỷ niệm";
      im.onload = function () {
        var r = im.naturalWidth / im.naturalHeight;
        s.style.aspectRatio = Math.min(1.6, Math.max(0.7, r));
      };
      im.onclick = function (ev) {
        ev.stopPropagation();
        show(src);
      };
      s.appendChild(im);
      f.classList.add("has");
      f._src = src;
      if (!cap.textContent) cap.textContent = "Kỷ niệm của lớp";
    }
    function clear() {
      s.style.aspectRatio = "";
      var im = s.querySelector("img,video");
      if (im) {
        if (im.pause) im.pause();
        im.remove();
      }
      if (f._vurl) {
        URL.revokeObjectURL(f._vurl);
        f._vurl = null;
      }
      f.classList.remove("has");
      f.classList.remove("vid");
      f._src = null;
      f._video = false;
    }
    function fillVid(u, po) {
      clear();
      var v = document.createElement("video");
      v.src = u;
      v.controls = true;
      v.playsInline = true;
      v.preload = po ? "none" : "metadata";
      if (po) v.poster = po;
      v.onplay = function () {
        var m = $("bgm");
        if (m && !m.paused) m.pause();
      };
      v.addEventListener("error", function () {
        if (v._fb) return;
        v._fb = 1;
        var o = document.createElement("div");
        o.className = "vfail";
        o.innerHTML = "Chưa có file video<br><b>Bấm để chọn video gốc</b>";
        o.onclick = function (e) {
          e.stopPropagation();
          inp.click();
        };
        s.appendChild(o);
      });
      s.appendChild(v);
      f.classList.add("has");
      f._src = u;
      f._vurl = u;
      f._video = true;
      f.classList.add("vid");
      s.style.aspectRatio = 1.78;
      if (!cap.textContent) cap.textContent = "Kỷ niệm của lớp";
    }
    f._fill = fill;
    f._fillVid = fillVid;
    s.onclick = function () {
      if (!f._src) inp.click();
    };
    s.onkeydown = function (e) {
      if ((e.key === "Enter" || e.key === " ") && !f._src) {
        e.preventDefault();
        inp.click();
      }
    };
    inp.onchange = function () {
      set(inp.files[0]);
      inp.value = "";
    };
    x.onclick = clear;
    s.addEventListener("dragover", function (e) {
      e.preventDefault();
      s.classList.add("over");
    });
    s.addEventListener("dragleave", function () {
      s.classList.remove("over");
    });
    s.addEventListener("drop", function (e) {
      e.preventDefault();
      s.classList.remove("over");
      set(e.dataTransfer.files[0]);
    });
    order.push(f);
    return f;
  }
  PS.forEach(function (p) {
    var f = slot($("string"), true);
    f._fill(p[0]);
    f.querySelector(".cap").textContent = p[1];
  });
  PV.forEach(function (p) {
    var f = slot($("wall"));
    f._fillVid(p[0], p[1]);
    f.querySelector(".cap").textContent = p[2];
  });
  PW.forEach(function (p) {
    var f = slot($("wall"));
    f._fill(p[0]);
    f.querySelector(".cap").textContent = p[1];
  });

  /* ---------- Xem ảnh phóng to (lightbox) ---------- */
  var lb = $("lb"),
    im = lb.querySelector("img");
  function filled() {
    return order.filter(function (o) {
      return o._src && !o._video;
    });
  }
  function show(src) {
    var l = filled();
    lbi = l
      .map(function (o) {
        return o._src;
      })
      .indexOf(src);
    im.src = src;
    lb.classList.add("on");
  }
  function step(d) {
    var l = filled();
    if (!l.length) return;
    lbi = (lbi + d + l.length) % l.length;
    im.src = l[lbi]._src;
  }
  lb.querySelector(".p").onclick = function (e) {
    e.stopPropagation();
    step(-1);
  };
  lb.querySelector(".n").onclick = function (e) {
    e.stopPropagation();
    step(1);
  };
  lb.querySelector(".c").onclick = function () {
    lb.classList.remove("on");
  };
  lb.onclick = function (e) {
    if (e.target === lb) lb.classList.remove("on");
  };
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") lb.classList.remove("on");
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---------- Nút "Gửi yêu thương đến cô" ---------- */
  $("love").onclick = function (ev) {
    var r = ev.currentTarget.getBoundingClientRect(),
      cx = r.left + r.width / 2,
      cy = r.top + r.height / 2,
      em = ["❤️", "🌺", "✨", "🌸", "💌"];
    for (var i = 0; i < 26; i++) {
      var d = document.createElement("span");
      d.className = "burst";
      d.textContent = em[i % em.length];
      var ang = Math.random() * 6.28,
        dist = 80 + Math.random() * 180;
      d.style.cssText =
        "left:" +
        cx +
        "px;top:" +
        cy +
        "px;--bx:" +
        Math.cos(ang) * dist +
        "px;--by:" +
        (Math.sin(ang) * dist - 60) +
        "px;--br:" +
        (Math.random() * 360 - 180) +
        "deg";
      document.body.appendChild(d);
      setTimeout(
        function (n) {
          n.remove();
        },
        1500,
        d,
      );
    }
  };

  /* ---------- Nhạc nền + màn hình chạm để mở ---------- */
  (function () {
    var a = $("bgm"),
      mb = $("music"),
      ov = $("cover");
    var userOff = false;
    function ui() {
      var on = !a.paused;
      mb.classList.toggle("playing", on);
      mb.setAttribute("aria-pressed", on);
      $("mt").textContent = on ? "T\u1eaft nh\u1ea1c" : "B\u1eadt nh\u1ea1c";
    }
    a.addEventListener("play", ui);
    a.addEventListener("pause", ui);
    a.volume = 0.85;
    mb.onclick = function () {
      if (a.paused) {
        userOff = false;
        var r = a.play();
        if (r && r.catch)
          r.catch(function () {
            a.load();
            a.play().catch(function () {});
          });
      } else {
        userOff = true;
        a.pause();
      }
    };
    /* chạm lần đầu ở bất kỳ đâu (trừ nút nhạc) sẽ bật nhạc nếu trình duyệt đã chặn tự phát */
    function kick(e) {
      if (e.target && e.target.closest && e.target.closest("#music")) return;
      ["pointerdown", "touchend", "keydown"].forEach(function (t) {
        removeEventListener(t, kick, true);
      });
      if (a.paused && !userOff) a.play().catch(function () {});
    }
    ["pointerdown", "touchend", "keydown"].forEach(function (t) {
      addEventListener(t, kick, true);
    });
    function openCover() {
      ov.classList.add("out");
      setTimeout(function () {
        ov.hidden = true;
      }, 700);
      a.play().catch(function () {});
    }
    ov.onclick = openCover;
    ov.onkeydown = function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCover();
      }
    };
    var p = a.play();
    if (p && p.catch)
      p.catch(function () {
        ov.hidden = false;
        ov.focus();
      });
  })();

  /* ---------- Hiệu ứng phụ: ngôi sao, thanh tiến trình, tia sáng, pháo hoa cuối trang ---------- */
  (function () {
    var rd = matchMedia("(prefers-reduced-motion:reduce)").matches;
    document.querySelectorAll(".sec").forEach(function (s) {
      var d = document.createElement("div");
      d.className = "orn";
      d.innerHTML = '<svg aria-hidden="true"><use href="#fl"/></svg>';
      s.parentNode.insertBefore(d, s);
    });
    if (rd) return;
    var st = $("stars");
    for (var i = 0; i < 28; i++) {
      var e = document.createElement("span");
      e.className = "star";
      e.textContent = i % 3 ? "\u2726" : "\u2727";
      e.style.cssText =
        "left:" +
        Math.random() * 100 +
        "%;top:" +
        Math.random() * 100 +
        "%;font-size:" +
        (8 + Math.random() * 12) +
        "px;animation-delay:-" +
        Math.random() * 3 +
        "s;animation-duration:" +
        (2 + Math.random() * 3) +
        "s";
      st.appendChild(e);
    }
    var pg = $("prog");
    addEventListener(
      "scroll",
      function () {
        var m = document.documentElement.scrollHeight - innerHeight;
        pg.style.width = (m > 0 ? (scrollY / m) * 100 : 0) + "%";
      },
      { passive: true },
    );
    var lt = 0;
    addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var n = Date.now();
      if (n - lt < 60) return;
      lt = n;
      var s = document.createElement("span");
      s.className = "spark";
      s.textContent = Math.random() < 0.5 ? "\u2726" : "\u273F";
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.color = Math.random() < 0.5 ? "#F6C945" : "#FF6A4D";
      document.body.appendChild(s);
      setTimeout(function () {
        s.remove();
      }, 900);
    });
    var ft = document.querySelector("footer");
    if ("IntersectionObserver" in window) {
      var fo = new IntersectionObserver(
        function (es) {
          if (es[0].isIntersecting) {
            fo.disconnect();
            var r = ft.getBoundingClientRect(),
              em = ["\uD83C\uDF3A", "\u2728", "\u2764\uFE0F", "\uD83C\uDF38"];
            for (var i = 0; i < 30; i++) {
              var d = document.createElement("span");
              d.className = "burst";
              d.textContent = em[i % 4];
              var a = Math.random() * 6.28,
                dist = 100 + Math.random() * 220;
              d.style.cssText =
                "left:" +
                (r.left + r.width / 2) +
                "px;top:" +
                (r.top + r.height / 2) +
                "px;--bx:" +
                Math.cos(a) * dist +
                "px;--by:" +
                (Math.sin(a) * dist - 80) +
                "px;--br:" +
                (Math.random() * 360 - 180) +
                "deg";
              document.body.appendChild(d);
              setTimeout(
                function (n) {
                  n.remove();
                },
                1500,
                d,
              );
            }
          }
        },
        { threshold: 0.6 },
      );
      fo.observe(ft);
    }
  })();

  /* ---------- Hiệu ứng thêm: ánh sáng chuột, hoa trôi, tim bay, nghiêng 3D, ảnh bay vào ---------- */
  (function () {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    var g = $("glow");
    addEventListener(
      "pointermove",
      function (e) {
        if (e.pointerType === "touch") return;
        g.style.left = e.clientX + "px";
        g.style.top = e.clientY + "px";
        g.style.opacity = 1;
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", function () {
      g.style.opacity = 0;
    });
    var f1 = document.querySelector(".f1"),
      f2 = document.querySelector(".f2");
    addEventListener(
      "scroll",
      function () {
        var y = scrollY;
        if (f1) f1.style.translate = "0 " + y * 0.25 + "px";
        if (f2) f2.style.translate = "0 " + -y * 0.12 + "px";
      },
      { passive: true },
    );
    setTimeout(function () {
      var t = $("t"),
        s = t.textContent;
      if (s.length > 3) {
        t.innerHTML = s
          .split(" ")
          .map(function (w) {
            return (
              '<span style="white-space:nowrap">' +
              w
                .split("")
                .map(function (c, i) {
                  return (
                    '<span class="ch" style="animation-delay:' +
                    i * 0.12 +
                    's">' +
                    c +
                    "</span>"
                  );
                })
                .join("") +
              "</span>"
            );
          })
          .join(" ");
      }
    }, 3400);
    setInterval(function () {
      if (document.hidden) return;
      var h = document.createElement("span");
      h.className = "heart";
      h.textContent = "\u2665";
      h.style.cssText =
        "left:" +
        Math.random() * 100 +
        "%;font-size:" +
        (14 + Math.random() * 18) +
        "px;color:" +
        (Math.random() < 0.5 ? "#FF6A4D" : "#FF8FA3") +
        ";opacity:.7;animation-duration:" +
        (8 + Math.random() * 6) +
        "s;--hx:" +
        (Math.random() * 120 - 60) +
        "px;--hr:" +
        (Math.random() * 60 - 30) +
        "deg";
      document.body.appendChild(h);
      setTimeout(function () {
        h.remove();
      }, 15000);
    }, 1400);
    document.addEventListener("click", function (e) {
      for (var i = 0; i < 10; i++) {
        var d = document.createElement("i");
        d.className = "tap";
        var a = Math.random() * 6.28,
          r = 30 + Math.random() * 50;
        d.style.cssText =
          "left:" +
          e.clientX +
          "px;top:" +
          e.clientY +
          "px;--tx:" +
          Math.cos(a) * r +
          "px;--ty:" +
          Math.sin(a) * r +
          "px;background:" +
          (i % 2 ? "#F6C945" : "#FF6A4D");
        document.body.appendChild(d);
        setTimeout(
          function (n) {
            n.remove();
          },
          800,
          d,
        );
      }
    });
    document.querySelectorAll(".wall .pol:not(.vid)").forEach(function (p) {
      p.addEventListener("pointermove", function (e) {
        if (e.pointerType === "touch") return;
        var r = p.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width - 0.5,
          y = (e.clientY - r.top) / r.height - 0.5;
        p.style.transform =
          "perspective(700px) rotateY(" +
          x * 16 +
          "deg) rotateX(" +
          -y * 16 +
          "deg) scale(1.06)";
      });
      p.addEventListener("pointerleave", function () {
        p.style.transform = "";
      });
    });
    if ("IntersectionObserver" in window) {
      var io2 = new IntersectionObserver(
        function (es) {
          es.forEach(function (en) {
            if (en.isIntersecting) {
              var el = en.target;
              io2.unobserve(el);
              el.classList.add("in");
              setTimeout(function () {
                el.classList.remove("fly", "in");
                el.style.transitionDelay = "";
              }, 1200);
            }
          });
        },
        { threshold: 0.15 },
      );
      document.querySelectorAll(".pol").forEach(function (p, i) {
        p.classList.add("fly");
        p.style.transitionDelay = (i % 4) * 0.12 + "s";
        io2.observe(p);
      });
    }
  })();

  /* ---------- Giấy nhớ lời nhắn (đọc dữ liệu từ notes.js) ---------- */
  var sc = 0;
  function stick(paras, name) {
    var d = document.createElement("div");
    d.className = "stick";
    d.style.setProperty("--r", ((sc++ % 5) - 2) * 2 + "deg");
    var m = document.createElement("div");
    m.className = "msg";
    m.contentEditable = "true";
    m.spellcheck = false;
    m.dataset.ph = "Viết lời nhắn gửi cô...";
    var w = document.createElement("div");
    w.className = "who";
    w.contentEditable = "true";
    w.spellcheck = false;
    w.dataset.ph = "Tên bạn";
    if (paras && paras.length) {
      paras.forEach(function (t) {
        var p = document.createElement("p");
        p.textContent = t;
        m.appendChild(p);
      });
      var n = paras.join("").length;
      if (n > 900) m.classList.add("xl");
      else if (n > 480) m.classList.add("lg");
      w.textContent = name || "";
    }
    if (paras && paras.length) {
      d.classList.add("filled");
      d.tabIndex = 0;
      d.setAttribute("role", "button");
      d.setAttribute("aria-label", "Đọc thư của " + (name || "bạn"));
      m.contentEditable = "false";
      w.contentEditable = "false";
    }
    d.append(m, w);
    $("sticks").appendChild(d);
  }
  NOTES.forEach(function (n) {
    stick(n.paras, n.name);
  });
  $("addstick").onclick = stick;

  /* ---------- Cửa sổ đọc thư đầy đủ ---------- */
  (function () {
    var nb = $("nb"),
      nbody = $("nbody"),
      ncnt = $("ncnt"),
      card = nb.querySelector(".card"),
      ni = 0,
      last = null;
    function list() {
      return [].slice.call(document.querySelectorAll(".stick.filled"));
    }
    function render() {
      var l = list(),
        st = l[ni];
      if (!st) return;
      card.style.background = getComputedStyle(st).backgroundColor;
      nbody.innerHTML =
        st.querySelector(".msg").innerHTML + '<div class="by"></div>';
      nbody.querySelector(".by").textContent =
        st.querySelector(".who").textContent;
      nbody.scrollTop = 0;
      ncnt.textContent = ni + 1 + " / " + l.length;
    }
    function open(st) {
      last = st;
      ni = list().indexOf(st);
      render();
      nb.classList.add("on");
      document.body.style.overflow = "hidden";
      nbody.focus();
    }
    function close() {
      nb.classList.remove("on");
      document.body.style.overflow = "";
      if (last) last.focus({ preventScroll: true });
    }
    function go(d) {
      var n = list().length;
      if (!n) return;
      ni = (ni + d + n) % n;
      render();
    }
    $("sticks").addEventListener("click", function (e) {
      var st = e.target.closest(".stick.filled");
      if (st) open(st);
    });
    $("sticks").addEventListener("keydown", function (e) {
      if (
        (e.key === "Enter" || e.key === " ") &&
        e.target.classList.contains("filled")
      ) {
        e.preventDefault();
        open(e.target);
      }
    });
    nb.querySelector(".pv").onclick = function (e) {
      e.stopPropagation();
      go(-1);
    };
    nb.querySelector(".nx").onclick = function (e) {
      e.stopPropagation();
      go(1);
    };
    nb.querySelector(".cl").onclick = close;
    nb.onclick = function (e) {
      if (e.target === nb) close();
    };
    document.addEventListener("keydown", function (e) {
      if (!nb.classList.contains("on")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    });
    var sx = null;
    nb.addEventListener(
      "touchstart",
      function (e) {
        sx = e.touches[0].clientX;
      },
      { passive: true },
    );
    nb.addEventListener(
      "touchend",
      function (e) {
        if (sx === null) return;
        var dx = e.changedTouches[0].clientX - sx;
        sx = null;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      },
      { passive: true },
    );
  })();

  /* ---------- Hiện dần khi cuộn tới ---------- */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.01 },
    );
    rv.forEach(function (n) {
      io.observe(n);
    });
  } else
    rv.forEach(function (n) {
      n.classList.add("in");
    });
})();
