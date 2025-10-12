import Chart from "react-apexcharts";

const StatusChart = ({ options, series }) => {
  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      width="250"
    />
  );
};

export default StatusChart;
