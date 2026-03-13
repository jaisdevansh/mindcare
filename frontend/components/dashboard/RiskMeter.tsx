'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const RiskMeter = ({ score }: { score: number }) => {
    // score is 0-100
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    const getColor = (s: number) => {
        if (s < 40) return '#10b981'; // Green
        if (s < 70) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    const getLabel = (s: number) => {
        if (s < 40) return 'Low Risk';
        if (s < 70) return 'Medium Risk';
        return 'High Risk';
    };

    const color = getColor(score);

    return (
        <Card className="flex flex-col items-center justify-center p-4">
            <CardHeader className="text-center pb-0">
                <CardTitle className="text-sm text-slate-400 font-medium">Risk Meter</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 w-full h-[200px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={180}
                            endAngle={0}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={5}
                        >
                            <Cell key="cell-0" fill={color} />
                            <Cell key="cell-1" fill="rgba(255,255,255,0.05)" />
                            <Label
                                position="center"
                                content={({ viewBox }) => {
                                    const { cx, cy } = viewBox as { cx: number; cy: number };
                                    return (
                                        <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central">
                                            <tspan x={cx} className="text-3xl font-bold fill-white">
                                                {score}
                                            </tspan>
                                            <tspan x={cx} dy="24" className="text-xs fill-slate-400">
                                                {getLabel(score)}
                                            </tspan>
                                        </text>
                                    );
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
