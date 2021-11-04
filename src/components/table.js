import React, { useEffect, useState } from "react";

const Table = (props) => {
  const [width, setWidth] = useState(1000);
  useEffect(() => {
      function handleResize(){
          setWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResize);
      handleResize();
  }, []);
  const columnsToKeep = props.columnsFilter
    ? props.columnsFilter(width)
    : Array.from({ length: props.header.length }, (x, i) => i);
  return (
    <table>
      <thead>
        <tr>
          {props.header
            .filter((node, index) => columnsToKeep.includes(index))
            .map(({ title, width }, index) => (
              <th key={title} style={{ minWidth: width }}>
                {title}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {props.data
          .filter((n) => n)
          .map((node, index) => {
            return (
              <tr key={node.id}>
                {node.data
                  .filter((node, index) => columnsToKeep.includes(index))
                  .map((node, index) => (
                    <td key={index}>{node}</td>
                  ))}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default Table;
