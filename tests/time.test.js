import { detectDate } from "../scripts/timestructures"
import { expect, test } from "vitest"

test('date in title: M/D/YY', () => {
    const block = ['1/2/24']
    expect(detectDate(block)).toBe('1-2')
})

test('date in title: M/D/YYYY', () => {
    const block = ['1/2/2024']
    expect(detectDate(block)).toBe('1-2')
})

test('date in title: MM/DD/YY', () => {
    const block = ['02/11/24']
    expect(detectDate(block)).toBe('2-11')
})

test('date in title: YYYY-MM-DD', () => {
    const block = ['2023-11-01']
    expect(detectDate(block)).toBe('11-1')
})

test('date in title: YYYYMMDD', () => {
    const block = ['20221101']
    expect(detectDate(block)).toBe('11-1')
})

test('date in text: DD mmmmm, YYYY', () => {
    const block = [undefined, 'Friend #019 23 May, 2024 Jennifer']
    expect(detectDate(block)).toBe('5-23')
})

test('date in text: mmmmm DDth, YYYY', () => {
    const block = [undefined, 'Friend #018 April 30, 2024 Bruno']
    expect(detectDate(block)).toBe('4-30')
})

test('dates not to recognize', () => {
    const block = ['David Wojnarowicz - Cross Country 1: February-March 1989 (Part 1)', '2021-08-31T08:56:59.785Z']
    expect(detectDate(block)).toBe('8-31')
})

test('numbers not to recognize', () => {
    const block = ['1 to 40 side by side', '2020-06-29T16:31:38.846Z']
    expect(detectDate(block)).toBe('6-29')
})

test('what about ranges?', () => {
    const block = ['4/6/23–4/8/23']
    expect(detectDate(block)).toBe('4-6')
})

test('abbreviated month', () => {
    const block = ['31Jan2024']
    expect(detectDate(block)).toBe('1-31')
})