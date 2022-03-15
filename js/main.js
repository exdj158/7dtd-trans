(function () {
  var ie = !!(window.attachEvent && !window.opera);
  var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && RegExp.$1 < 525;
  var fn = [];
  var run = function () {
    for (var i = 0; i < fn.length; i++) fn[i]();
  };
  var d = document;
  d.ready = function (f) {
    if (!ie && !wk && d.addEventListener)
      return d.addEventListener("DOMContentLoaded", f, false);
    if (fn.push(f) > 1) return;
    if (ie)
      (function () {
        try {
          d.documentElement.doScroll("left");
          run();
        } catch (err) {
          setTimeout(arguments.callee, 0);
        }
      })();
    else if (wk)
      var t = setInterval(function () {
        if (/^(loaded|complete)$/.test(d.readyState)) clearInterval(t), run();
      }, 0);
  };
})();

function lineSplit(str) {
  var temp = str.replace(/"[^"]*"/g, (match) => match.replace(/,/g, "{}"));
  return temp.split(",").map((value) => value.replace(/{}/g, ","));
}

function saveFile(data, filename) {
  if (!data) {
    alert("保存失败，数据为空！");
    return;
  }

  if (!filename) filename = "test.txt";

  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 4);
  }

  let blob = new Blob([data], { type: "text/json" }),
    a = document.createElement("a");
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  let event = new MouseEvent("click", {});
  a.dispatchEvent(event);
}

document.ready(() => {
  const dataList = [];
  const errList = [];
  const inputEl = document.getElementById("uploadBtn");
  const saveBtnEl = document.getElementById("saveBtn");

  const container = document.getElementById("table");
  function initTable() {
    const hot = new Handsontable(container, {
      data: dataList,
      height: 500,
      colHeaders: true,
      rowHeaders: true,
      licenseKey: "non-commercial-and-evaluation",
      renderAllRows: false,
      colHeaders: ["Key", "文件", "类型", "英文", "中文"],
      columns: [
        { data: "Key", readOnly: true },
        { data: "File", readOnly: true },
        { data: "Type", readOnly: true },
        { data: "english" },
        { data: "schinese" },
      ],
      colWidths: [300, 100, 100, 200, 400],
    });
    return hot;
  }

  inputEl.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = function () {
      const text = this.result;
      let index = 0;

      text.split("\n").forEach((line) => {
        const arr = lineSplit(line);

        if (arr.length === 20) {
          const data = {
            Key: arr[0],
            File: arr[1],
            Type: arr[2],
            UsedInMainMenu: arr[3],
            NoTranslate: arr[4],
            english: arr[5],
            Context: arr[6],
            german: arr[7],
            latam: arr[8],
            french: arr[9],
            italian: arr[10],
            japanese: arr[11],
            koreana: arr[12],
            polish: arr[13],
            brazilian: arr[14],
            russian: arr[15],
            turkish: arr[16],
            schinese: arr[17],
            tchinese: arr[18],
            spanish: arr[19],
          };

          dataList.push(data);
        } else {
          index += 1;
          errList.push(arr);
        }
      });

      initTable();
      console.log(`解析结束，有${index}条记录解析失败`, errList);
    };
  });

  saveBtnEl.addEventListener("click", function () {
    saveFile(
      dataList
        .map(
          ({
            Key,
            File,
            Type,
            UsedInMainMenu,
            NoTranslate,
            english,
            Context,
            german,
            latam,
            french,
            italian,
            japanese,
            koreana,
            polish,
            brazilian,
            russian,
            turkish,
            schinese,
            tchinese,
            spanish,
          }) => {
            return `${Key},${File},${Type},${UsedInMainMenu},${NoTranslate},${english},${Context},${german},${latam},${french},${italian},${japanese},${koreana},${polish},${brazilian},${russian},${turkish},${schinese},${tchinese},${spanish}`;
          }
        )
        .join("\n")
    );
  });
});
