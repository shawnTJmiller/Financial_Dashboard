import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, DoughnutController, ArcElement, Tooltip, Plugin } from 'chart.js';
import { getGaugeConfig } from '../utils/gaugeConfig';

// Register Chart.js components
ChartJS.register(DoughnutController, ArcElement, Tooltip);

interface GaugeProps {
  min: number;
  max: number;
  value: number;
  label: string;
  visible: boolean;
  size?: number;
}

export const Gauge: React.FC<GaugeProps> = ({
  min,
  max,
  value,
  label,
  visible,
  size = 200,
}) => {
  if (!visible) return null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const config = getGaugeConfig(label);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Clamp value between min and max
    const clampedValue = Math.max(min, Math.min(max, value));
    const maxLabel = clampedValue > config.maxSavings ? clampedValue : config.maxSavings;

    // Calculate color stops
    let yellowColorStop = config.baseYellowColorStop;
    let greenColorStop = config.baseGreenColorStop;

    if (clampedValue > config.maxSavings) {
      yellowColorStop *= (config.maxSavings / clampedValue) * config.baseYellowColorStop;
      greenColorStop = (config.maxSavings / clampedValue) * config.baseGreenColorStop;
    }

    // Create gradient
    const chartWidth = canvasRef.current.getBoundingClientRect().width;
    const gradientSegment = ctx.createLinearGradient(0, 0, chartWidth - 46, 0);
    gradientSegment.addColorStop(0, 'red');
    gradientSegment.addColorStop(yellowColorStop, 'yellow');
    gradientSegment.addColorStop(greenColorStop, 'green');

    // Create custom plugin for text labels
    const gaugeChartText: Plugin = {
      id: 'gaugeChartText',
      afterDatasetsDraw(chart) {
        const { ctx, chartArea: { left, right } } = chart as any;
        ctx.save();

        const xCoord = (chart as any).getDatasetMeta(0).data[0].x;
        const yCoord = (chart as any).getDatasetMeta(0).data[0].y;

        function textLabel(text: string | number, x: number, y: number, fontSize: number, textBaseline: string, textAlign: string) {
          ctx.font = `${fontSize}px sans-serif`;
          ctx.fillStyle = 'rgba(102, 102, 102, 1)';
          ctx.textBaseline = textBaseline;
          ctx.textAlign = textAlign;
          ctx.fillText(text.toLocaleString(), x, y);
        }

        // Draw min/max labels and current value
        textLabel(
          '$' + config.minSavings.toLocaleString(),
          left + config.leftTextAdjustment,
          yCoord + config.verticalTextAdjustmentForMinMaxLabels,
          20,
          'top',
          'left'
        );
        textLabel(
          '$' + maxLabel.toLocaleString(),
          right + config.rightTextAdjustment,
          yCoord + config.verticalTextAdjustmentForMinMaxLabels,
          20,
          'top',
          'right'
        );
        textLabel(
          '$' + clampedValue.toLocaleString(),
          xCoord,
          yCoord + config.verticalTextAdjustmentForCurrentSavingsLabel,
          45,
          'top',
          'center'
        );

        ctx.restore();
      },
    };

    const chartData = {
      labels: ['Money Reserve', 'To Goal'],
      datasets: [
        {
          data: [clampedValue, Math.max(0, config.maxSavings - clampedValue)],
          backgroundColor: [gradientSegment, 'rgba(0, 0, 0, 0.2)'],
          borderColor: [gradientSegment, 'rgba(0, 0, 0, 1)'],
          borderWidth: 0,
        },
      ],
    };

    const chartConfig = {
      type: 'doughnut' as const,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        circumference: config.baseCircumference,
        rotation: config.baseRotation,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
        },
      },
      plugins: [gaugeChartText],
    };

    chartRef.current = new ChartJS(ctx, chartConfig);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [value, label, min, max, config, visible]);

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: '100%', height: `${size}px`, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
          }}
        />
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-200 text-center">{label}</p>
    </div>
  );
};
