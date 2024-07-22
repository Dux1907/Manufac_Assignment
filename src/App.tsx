import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Table } from "@mantine/core";
import data from "../../Manufac_Assignment/Manufac _ India Agro Dataset.js";

export default function App() {
  function generateElements(baseYear: number, maxYear: number) {
    const elements: { year: number; maximum: number; minimum: number }[] = [];
    for (let i = baseYear; i <= maxYear; i += 1) {
      elements.push({
        year: i,
        maximum: findMaximum(i),
        minimum: findMinimum(i),
      });
    }
    return elements;
  }
  const filteredData = data.filter(
    (item) => item["Crop Production (UOM:t(Tonnes))"] !== ""
  );

  function findMaximum(year: number) {
    return filteredData
      .filter(
        (element) => element.Year === `Financial Year (Apr - Mar), ${year}`
      )
      .reduce((prev, curr) => {
        return curr["Crop Production (UOM:t(Tonnes))"] >
          prev["Crop Production (UOM:t(Tonnes))"]
          ? curr
          : prev;
      })["Crop Production (UOM:t(Tonnes))"];
  }
  function findMinimum(year: number) {
    return filteredData
      .filter(
        (element) => element.Year === `Financial Year (Apr - Mar), ${year}`
      )
      .reduce((prev, curr) => {
        return curr["Crop Production (UOM:t(Tonnes))"] <
          prev["Crop Production (UOM:t(Tonnes))"]
          ? curr
          : prev;
      })["Crop Production (UOM:t(Tonnes))"];
  }
  
  const elements = generateElements(1950, 2020);
  const rows = elements.map((element) => (
    <Table.Tr key={element.year}>
      <Table.Td>{element.year}</Table.Td>
      <Table.Td>{element.maximum}</Table.Td>
      <Table.Td>{element.minimum}</Table.Td>
    </Table.Tr>
  ));

  const groupedData = filteredData.reduce((acc: any, item: any) => {
    if (!acc[item["Crop Name"]]) {
      acc[item["Crop Name"]] = [];
    }
    acc[item["Crop Name"]].push(item);
    return acc;
  }, {});
  const elements1: {
    crop: string;
    averageCropProduction: number;
    averageAreaUnderCultivation: number;
  }[] = [];

  Object.keys(groupedData).forEach((cropName) => {
    const total = groupedData[cropName].reduce((prev, curr) => {
      return prev + curr["Crop Production (UOM:t(Tonnes))"];
    }, 0);
    const total1 = groupedData[cropName].reduce((prev, curr) => {
      return prev + curr["Area Under Cultivation (UOM:Ha(Hectares))"];
    }, 0);
    elements1.push({
      crop: cropName,
      averageCropProduction: (total/71).toFixed(3),
      averageAreaUnderCultivation: (total1/71).toFixed(3),
    });
  });

  const columns = elements1.map((element) => (
    <Table.Tr key={element.crop}>
      <Table.Td>{element.crop}</Table.Td>
      <Table.Td>{(element.averageCropProduction)}</Table.Td>
      <Table.Td>{(element.averageAreaUnderCultivation)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <MantineProvider theme={theme}>
      <h1 style={{ textAlign: "center" }}>Frontend Data Analytics Task</h1>
      <h2 style={{ marginLeft: "2rem" }}>Table 1</h2>
      <Table
        horizontalSpacing="xl"
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Year</Table.Th>
            <Table.Th>Crop with Maximum Production in that Year</Table.Th>
            <Table.Th>Crop with Minimum Production in that Year</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <h2 style={{ marginLeft: "2rem" }}>Table 2</h2>
      <Table
        horizontalSpacing="xl"
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Crops</Table.Th>
            <Table.Th>Average Yield of the Crop between 1950-2020</Table.Th>
            <Table.Th>
              Average Cultivation Area of the Crop between 1950-2020
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{columns}</Table.Tbody>
      </Table>
    </MantineProvider>
  );
}
