import { Group, Switch, Text, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useEffect, useState, useRef } from 'react';
import { TbClock, TbInfinity } from 'react-icons/tb';

interface WorkTimeSelectorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function WorkTimeSelector({ value, onChange, label }: WorkTimeSelectorProps) {
    const is24_7 = value === '24/7';

    // Parse initial value
    const initialTimes = value.includes('-') ? value.split('-').map(t => t.trim()) : ['09:00', '18:00'];
    const [startTime, setStartTime] = useState(initialTimes[0] || '09:00');
    const [endTime, setEndTime] = useState(initialTimes[1] || '18:00');

    const startTimeRef = useRef<HTMLInputElement>(null);
    const endTimeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (is24_7) {
            if (value !== '24/7') onChange('24/7');
        } else {
            const newValue = `${startTime} - ${endTime}`;
            if (value !== newValue) onChange(newValue);
        }
    }, [is24_7, startTime, endTime]);

    const handleToggle = (checked: boolean) => {
        if (checked) {
            onChange('24/7');
        } else {
            onChange(`${startTime} - ${endTime}`);
        }
    };

    return (
        <Stack gap="xs">
            {label && <Text fw={500} fz="sm">{label}</Text>}

            <Group justify="space-between" p="sm" style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: is24_7 ? '#f8f9fa' : 'white'
            }}>
                <Group gap="sm">
                    {is24_7 ? <TbInfinity size={20} color="#228be6" /> : <TbClock size={20} color="#adb5bd" />}
                    <Text size="sm" fw={is24_7 ? 600 : 400}>
                        {is24_7 ? '24/7 (Har doim ochiq)' : 'Ish vaqti oralig\'i'}
                    </Text>
                </Group>

                <Switch
                    checked={is24_7}
                    onChange={(event) => handleToggle(event.currentTarget.checked)}
                    color="blue"
                    size="md"
                />
            </Group>

            {!is24_7 && (
                <Group grow gap="md">
                    <TimeInput
                        label="Dan"
                        ref={startTimeRef}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        rightSection={
                            <TbClock
                                size={16}
                                style={{ cursor: 'pointer' }}
                                onClick={() => startTimeRef.current?.showPicker()}
                            />
                        }
                    />
                    <TimeInput
                        label="Gacha"
                        ref={endTimeRef}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        rightSection={
                            <TbClock
                                size={16}
                                style={{ cursor: 'pointer' }}
                                onClick={() => endTimeRef.current?.showPicker()}
                            />
                        }
                    />
                </Group>
            )}
        </Stack>
    );
}
