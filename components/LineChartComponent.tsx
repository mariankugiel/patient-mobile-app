import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText } from 'react-native-svg';
import Colors from '@/constants/colors';

interface DataPoint {
  date: string;
  value: number | string | number[];
}

interface LineChartProps {
  data: DataPoint[];
  referenceValue?: string;
  width?: number;
  height?: number;
  color?: string;
  isDoubleValue?: boolean;
  showAxis?: boolean;
  chartType?: 'line' | 'bar';
}

const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  referenceValue,
  width = Dimensions.get('window').width - 40,
  height = 150,
  color = Colors.primary,
  isDoubleValue = false,
  showAxis = true,
  chartType = 'line',
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.noDataText}>Sem dados disponíveis</Text>
      </View>
    );
  }

  // Parse values for single or double values (like blood pressure)
  const parseValue = (value: number | string | number[]): number[] => {
    if (Array.isArray(value)) {
      return value.filter(v => !isNaN(v));
    }
    
    if (typeof value === 'number') {
      return isNaN(value) ? [] : [value];
    }
    
    if (isDoubleValue && typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 2) {
        const val1 = parseInt(parts[0], 10);
        const val2 = parseInt(parts[1], 10);
        return [val1, val2].filter(v => !isNaN(v));
      }
    }
    
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? [] : [parsed];
  };

  // Parse reference values
  const parseReference = (ref: string | undefined): number[] => {
    if (!ref) return [];
    
    if (isDoubleValue) {
      const parts = ref.split('/');
      if (parts.length === 2) {
        const val1 = parseInt(parts[0], 10);
        const val2 = parseInt(parts[1], 10);
        return [val1, val2].filter(v => !isNaN(v));
      }
    }
    
    // Handle ranges like "70-99"
    if (ref.includes('-')) {
      const [min, max] = ref.split('-');
      const minVal = parseFloat(min);
      const maxVal = parseFloat(max);
      return [minVal, maxVal].filter(v => !isNaN(v));
    }
    
    const parsed = parseFloat(ref);
    return isNaN(parsed) ? [] : [parsed];
  };

  // Extract values for plotting
  const values: number[][] = data.map(d => parseValue(d.value));
  
  // Find min and max for scaling
  let minValue = Number.MAX_VALUE;
  let maxValue = Number.MIN_VALUE;
  
  values.forEach(valueArray => {
    valueArray.forEach(val => {
      if (!isNaN(val)) {
        if (val < minValue) minValue = val;
        if (val > maxValue) maxValue = val;
      }
    });
  });
  
  // Add some padding to min/max
  const padding = (maxValue - minValue) * 0.1;
  minValue = Math.max(0, minValue - padding);
  maxValue = maxValue + padding;
  
  // Parse reference values if provided
  const refValues = parseReference(referenceValue);
  
  // If reference values are provided, adjust min/max
  if (refValues.length > 0) {
    refValues.forEach(ref => {
      if (ref < minValue) minValue = ref;
      if (ref > maxValue) maxValue = ref;
    });
  }
  
  // Calculate positions
  const chartWidth = width - 40; // Padding
  const chartHeight = height - 40; // Padding
  const xStep = chartWidth / (data.length - 1 || 1);
  
  // Function to scale Y value
  const scaleY = (value: number) => {
    if (isNaN(value) || isNaN(minValue) || isNaN(maxValue)) {
      return 0;
    }
    const range = maxValue - minValue;
    if (range === 0) {
      return chartHeight / 2 + 20;
    }
    return chartHeight - ((value - minValue) / range) * chartHeight + 20;
  };
  
  // Generate path for each line (systolic and diastolic for blood pressure)
  const generatePath = (valueIndex: number) => {
    let path = '';
    
    data.forEach((d, i) => {
      const x = i * xStep + 20;
      const parsedValues = parseValue(d.value);
      const y = valueIndex < parsedValues.length ? scaleY(parsedValues[valueIndex]) : 0;
      
      if (i === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };
  
  // Generate dots for each data point
  const generateDots = (valueIndex: number) => {
    return data
      .map((d, i) => {
        const x = i * xStep + 20;
        const parsedValues = parseValue(d.value);
        
        if (valueIndex >= parsedValues.length) return null;
        
        const value = parsedValues[valueIndex];
        if (isNaN(value)) return null;
        
        const y = scaleY(value);
        if (isNaN(y)) return null;
        
        return (
          <Circle
            key={`dot-${valueIndex}-${i}`}
            cx={x}
            cy={y}
            r={3}
            fill={color}
          />
        );
      })
      .filter(dot => dot !== null);
  };
  
  // Generate reference lines
  const generateReferenceLines = () => {
    return refValues
      .filter(ref => !isNaN(ref))
      .map((ref, i) => {
        const y = scaleY(ref);
        
        if (isNaN(y)) return null;
        
        return (
          <Line
            key={`ref-${i}`}
            x1={20}
            y1={y}
            x2={width - 20}
            y2={y}
            stroke={Colors.textLight}
            strokeWidth={1}
            strokeDasharray="5,5"
          />
        );
      })
      .filter(line => line !== null);
  };
  
  // Generate axis
  const generateAxis = () => {
    if (!showAxis) return null;
    
    return (
      <>
        {/* Y-axis */}
        <Line
          x1={20}
          y1={20}
          x2={20}
          y2={height - 20}
          stroke={Colors.border}
          strokeWidth={1}
        />
        
        {/* X-axis */}
        <Line
          x1={20}
          y1={height - 20}
          x2={width - 20}
          y2={height - 20}
          stroke={Colors.border}
          strokeWidth={1}
        />
        
        {/* Y-axis labels */}
        <SvgText
          x={15}
          y={25}
          fontSize={10}
          textAnchor="end"
          fill={Colors.textLight}
        >
          {Math.round(maxValue)}
        </SvgText>
        
        <SvgText
          x={15}
          y={height - 15}
          fontSize={10}
          textAnchor="end"
          fill={Colors.textLight}
        >
          {Math.round(minValue)}
        </SvgText>
        
        {/* X-axis labels (first and last date) */}
        {data.length > 0 && (
          <>
            <SvgText
              x={20}
              y={height - 5}
              fontSize={10}
              textAnchor="middle"
              fill={Colors.textLight}
            >
              {new Date(data[0].date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </SvgText>
            
            <SvgText
              x={width - 20}
              y={height - 5}
              fontSize={10}
              textAnchor="middle"
              fill={Colors.textLight}
            >
              {new Date(data[data.length - 1].date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </SvgText>
          </>
        )}
      </>
    );
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Reference lines */}
        {generateReferenceLines()}
        
        {/* Axis */}
        {generateAxis()}
        
        {/* Lines */}
        {isDoubleValue ? (
          <>
            <Path
              d={generatePath(0)}
              stroke={color}
              strokeWidth={2}
              fill="none"
            />
            <Path
              d={generatePath(1)}
              stroke={`${color}80`} // Semi-transparent
              strokeWidth={2}
              fill="none"
              strokeDasharray="5,3"
            />
          </>
        ) : (
          <Path
            d={generatePath(0)}
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        )}
        
        {/* Dots */}
        {isDoubleValue ? (
          <>
            {generateDots(0)}
            {generateDots(1)}
          </>
        ) : (
          generateDots(0)
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: Colors.textLight,
    fontSize: 14,
  },
});

export default LineChartComponent;