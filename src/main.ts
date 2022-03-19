import Handsontable from "handsontable";
import * as localForage from "localforage";
import "handsontable/dist/handsontable.full.css";
import "./tailwind.css";

function lineSplit(str: string) {
  const temp = str.replace(/"[^"]*"/g, (match) => match.replace(/,/g, "{}"));
  return temp.split(",").map((value) => value.replace(/{}/g, ","));
}

function saveFile(data, filename?: string) {
  if (!data) {
    alert("保存失败，数据为空！");
    return;
  }

  if (!filename) filename = "Localization.txt";

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

async function main() {
  const saves = await localForage.getItem<{
    dataList?: string[][];
    fileName?: string;
  }>("saves");

  const dataList = saves?.dataList || [];
  let fileName = saves?.fileName || "";
  let handsontableInstance: Handsontable = null;
  const errList = [];
  const inputEl = document.getElementById("uploadBtn");
  const saveBtnEl = document.getElementById("saveBtn");

  const container = document.getElementById("table");
  function initTable() {
    handsontableInstance = new Handsontable(container, {
      data: dataList,
      height: 500,
      rowHeaders: true,
      licenseKey: "non-commercial-and-evaluation",
      renderAllRows: false,
      colHeaders: true,
      contextMenu: [`hidden_columns_show`, `hidden_columns_hide`],
      hiddenColumns: {
        indicators: true,
      },
      wordWrap: true,
      colWidths: 200,
      afterChange: function (change, source) {
        if (source === "loadData") {
          return; //don't save this change
        }
        localForage.setItem("saves", { dataList, fileName });
      },
    });
  }

  if (dataList.length > 0) {
    initTable();
  }

  inputEl.addEventListener("change", function (e) {
    const file = (e.target as HTMLInputElement).files[0];
    dataList.length = 0;
    fileName = file.name;
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = function () {
      const text = this.result as string;
      let index = 0;
      const keysLine = text.split("\n")[0];
      const keysArr = lineSplit(keysLine);
      const keysLength = keysArr.length;

      text.split("\n").forEach((line) => {
        const arr = lineSplit(line);

        if (arr.length === keysLength) {
          dataList.push(arr);
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
    const str = dataList.map((item) => item.join(",")).join("\n");
    saveFile(str, fileName);
  });
}

main();
