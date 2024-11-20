import { parseDocument } from "htmlparser2";
import { findOne } from "domutils";
import { default as serialize } from "dom-serializer";

export const fetchContentService = async (url, isJson) => {
  if (!url) {
    console.log("URL is required.");
    return null;
  }

  let jsonResponse = {};

  if (isJson) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        jsonResponse.eeContent = null;
      }
      // check if response is valid json
      if (!response.headers.get("content-type").includes("application/json")) {
        console.log("Response is not JSON.");
        jsonResponse.eeContent = null;
      }

      const json = await response.json();

      const jsonLatest = json.rounds[0];
      // console.log("Fetched jsonLatest:", jsonLatest);
      jsonResponse.eeContent = jsonLatest;
    } catch (error) {
      console.log(error);
      jsonResponse.eeContent = null;
    }
  }

  if (!isJson) {
    try {
      const response = await fetch(url);
      // console.log("response",response);
      const html = await response.text();
      // console.log("html", html);
      const dom = parseDocument(html);

      // Traverse the DOM tree to find the element with id "results"
      const resultsElement = findOne(
        (elem) => elem.name === "table",
        dom.children,
        true
      );

      // console.log("resultsElement", resultsElement);
      if (resultsElement) {
        const processTable = () => {
          // console.log("table element found.");
          // console.log(resultsElement);
          const tbody = resultsElement.children.find(
            (child) => child.name === "tbody"
          );
          if (!tbody) {
            console.log("No tbody found in table.");
            return [];
          }

          const rows = tbody.children.filter((child) => child.name === "tr");
          // console.log("rows", rows);
          if (rows.length > 0) {
            const firstRow = rows[0];
            // console.log("firstRow", firstRow);
            const cells = firstRow.children.filter(
              (child) => child.name === "td"
            );
            // console.log("cells", cells[0].children[0].data);

            if (!jsonResponse.bcContent) {
              jsonResponse.bcContent = {};
            }
            // Assuming cells[0].children[0].data contains the date string
            const dateString = cells[0].children[0].data;
            const parsedDate = new Date(dateString);

            // Normalize the date to UTC
            const utcDate = new Date(
              Date.UTC(
                parsedDate.getUTCFullYear(),
                parsedDate.getUTCMonth(),
                parsedDate.getUTCDate()
              )
            );

            jsonResponse.bcContent.date = utcDate;
            console.log(
              "jsonResponse.bcContent.date",
              jsonResponse.bcContent.date
            );
          } else {
            console.log("No rows found in tbody.");
            jsonResponse.bcContent = null;
          }
        };
        processTable();

        // put HTML as string and put it in the response object
        if (!jsonResponse.bcContent) {
          jsonResponse.bcContent = {};
        }

        jsonResponse.bcContent.tableContent = serialize(resultsElement);
      } else {
        console.log("table element not found or has no children.");
        jsonResponse.bcContent = null;
      }
    } catch (error) {
      console.log(error);
      jsonResponse.bcContent = null;
    }
  }

  // console.log("jsonResponse", jsonResponse);
  return jsonResponse;
};
