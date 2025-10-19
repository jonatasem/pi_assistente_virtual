import Chart from "react-apexcharts";

const BarChart = ({ options, series }) => {
  return <Chart options={options} series={series} type="bar" width="250" />;
};

export default BarChart;
