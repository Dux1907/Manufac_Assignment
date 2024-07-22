import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Table } from "@mantine/core";
import data from "../../Manufac_Assignment/Manufac _ India Agro Dataset.js";

export default function App() {
  function generateElements(
    baseYear: number,
    maxYear: number
  ): { year: number; maximum: string; minimum: string }[] {
    const elements: { year: number; maximum: string; minimum: string }[] = [];
    for (let i = baseYear; i <= maxYear; i += 1) {
      elements.push({
        year: i,
        maximum: findMaximum(i),
        minimum: findMinimum(i),
      });
    }
    return elements;
  }
  //Creating data for Table 1.
  interface CropData {
    Country: string;
    Year: string;
    "Crop Name": string;
    "Crop Production (UOM:t(Tonnes))": any;
    "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": number;
    "Area Under Cultivation (UOM:Ha(Hectares))": number;
  }
  const filteredData: CropData[] = data.filter(
    (item: CropData) => item["Crop Production (UOM:t(Tonnes))"] !== ""
  );
  //Some elements have values "",so filtered data just filters those values.
  function findMaximum(year: number): string {
    return filteredData
      .filter(
        (element) => element.Year === `Financial Year (Apr - Mar), ${year}`
      )
      .reduce((prev, curr) => {
        return curr["Crop Production (UOM:t(Tonnes))"] >
          prev["Crop Production (UOM:t(Tonnes))"]
          ? curr
          : prev;
      })["Crop Name"];
  } // Reduce function to parse the data to find Maximum Production Crop.
  function findMinimum(year: number): string {
    return filteredData
      .filter(
        (element) => element.Year === `Financial Year (Apr - Mar), ${year}`
      )
      .reduce((prev, curr) => {
        return curr["Crop Production (UOM:t(Tonnes))"] <
          prev["Crop Production (UOM:t(Tonnes))"]
          ? curr
          : prev;
      })["Crop Name"];
  }
  // Reduce function to parse the data to find Minimum Production Crop

  const elements: { year: number; maximum: string; minimum: string }[] =
    generateElements(1950, 2020);
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
  //Reduce function to align all the same crops together
  const elements1: {
    crop: string;
    averageCropProduction: number;
    averageAreaUnderCultivation: number;
  }[] = [];

  Object.keys(groupedData).forEach((cropName) => {
    const total = groupedData[cropName].reduce(
      (prev: number, curr: CropData) => {
        return prev + curr["Crop Production (UOM:t(Tonnes))"];
      },
      0
    );
    const total1 = groupedData[cropName].reduce(
      (prev: number, curr: CropData) => {
        return prev + curr["Area Under Cultivation (UOM:Ha(Hectares))"];
      },
      0
    );
    elements1.push({
      crop: cropName,
      averageCropProduction: Number((total / 71).toFixed(3)),
      averageAreaUnderCultivation: Number((total1 / 71).toFixed(3)),
    });
  });
  //Creating data for Table 2

  const columns = elements1.map((element) => (
    <Table.Tr key={element.crop}>
      <Table.Td>{element.crop}</Table.Td>
      <Table.Td>{element.averageCropProduction}</Table.Td>
      <Table.Td>{element.averageAreaUnderCultivation}</Table.Td>
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
