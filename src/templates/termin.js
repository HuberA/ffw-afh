import React from "react";
import { graphql, Link } from "gatsby";
import { LayoutComponent } from "../components/layout";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Seo from "../components/seo";
import Table from "../components/table";
import { DateTime } from "luxon";
import { redButton } from "../components/navigation";

//styles

const dayFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
const timeFormatOptions = { hour: "2-digit", minute: "2-digit" };

const noBottomMargin = css`
  margin-bottom: 0;
`;

//markup

const terminView = ({ data }) => {
  const termin = data.ical;
  const datum = DateTime.fromISO(termin.start)
    .setZone("Europe/Berlin")
    .setLocale("de");
  const endDate = DateTime.fromISO(termin.end)
    .setZone("Europe/Berlin")
    .setLocale("de");
  const showStartTime = datum.hour != 0 || datum.minute != 0;
 
  const nextDay = datum.plus({days:1});
  const isWholeDay = endDate.year === nextDay.year && endDate.month === nextDay.month && endDate.day === nextDay.day && datum.hour === 0 && datum.minute === 0;
  console.log(`is whole day: ${isWholeDay} ${endDate.minus({ days: 1 }) } vs ${datum}, hour: ${datum.hour}, ${datum.minute} ${endDate.minus({ days: 1 }) === datum} ${datum.hour === 0} ${datum.minute === 0}`)
  const isSameDay = endDate.day == datum.day && endDate.month == datum.month && endDate.year == datum.year;

  let tableData = [
    {
      id: "datum",
      data: [
        <div>Datum</div>,
        <div>
          <p css={noBottomMargin}>
            {datum.toLocaleString(dayFormatOptions)}
          </p>
          {showStartTime && <p css={noBottomMargin}>
            {datum.toLocaleString(timeFormatOptions) + " Uhr"}
          </p>}
        </div>,
      ],
    },];
  if (!isWholeDay){
    tableData.push({
      id: "ende",
      data: [<div>Ende</div>,  <div>
      {!isSameDay && <p css={noBottomMargin}>
        {endDate.toLocaleString(dayFormatOptions)}
      </p>}
      {showStartTime && <p css={noBottomMargin}>
        {endDate.toLocaleString(timeFormatOptions) + " Uhr"}
      </p>}
    </div>,]
    })
  }
  if(termin.description != null){
    tableData.push(
      {
        id: "beschreibung",
        data: [<div>Beschreibung</div>, <div>{termin.description}</div>],
      },
    );
  }
  tableData.push(...[
    {
      id: "ort",
      data: [<div>Ort</div>, <div>{termin.location}</div>],
    },
    {
      id: "kategorie",
      data: [<div>Kategorie</div>, <div>{(termin.sourceInstanceName === "vereins-kalender") ? "Verein" : ""}</div>],
    },
  ]);


  return (
    <LayoutComponent>
      <Seo
        title={termin.summary}
        description_short={termin.description}
        description_long={termin.description}
        url={`http://feuerwehr-altfraunhofen.de/termine/${termin.id}`}
      />
      <div>
        <h1>{termin.summary}</h1>
        <Table
          header={["", ""]}
          data={tableData}
        />
      </div>
      <Link css={redButton} to={`/kalender`}>
        Zurück
      </Link>
    </LayoutComponent>
  );
};

export default terminView;

export const query = graphql`
query ($id: String) {
  ical(id: {eq: $id}) {
    id
    start
    end
    description
    location
    summary
    sourceInstanceName
  }
}
`;
