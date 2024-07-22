import { detectDate, validDate } from "../scripts/timestructures"
import { expect, test } from "vitest"

test('validDate', () => {
    expect(validDate(['80-32', '3055'])).toBe(false)
    expect(validDate(['1-24', '2042'])).toBe(true)
})

test('date in title: M/D/YY', () => {
    const block = ['1/2/24']
    expect(detectDate(block)[0]).toBe('1-2')
    expect(detectDate(block)[1]).toBe('2024')
})

test('date in title: M/D/YYYY', () => {
    const block = ['1/2/2024']
    expect(detectDate(block)[0]).toBe('1-2')
    expect(detectDate(block)[1]).toBe('2024')
})

test('date in title: MM/DD/YY', () => {
    const block = ['02/11/24']
    expect(detectDate(block)[0]).toBe('2-11')
    expect(detectDate(block)[1]).toBe('2024')
})

test('date in title: YYYY-MM-DD', () => {
    const block = ['2023-11-01']
    expect(detectDate(block)[0]).toBe('11-1')
    expect(detectDate(block)[1]).toBe('2023')
})

test('date in title: YYYYMMDD', () => {
    const block = ['20221101']
    expect(detectDate(block)[0]).toBe('11-1')
    expect(detectDate(block)[1]).toBe('2022')
})

test('date in text: DD mmmmm, YYYY', () => {
    const block = [undefined, 'Friend #019 23 May, 2024 Jennifer']
    expect(detectDate(block)[0]).toBe('5-23')
    expect(detectDate(block)[1]).toBe('2024')
})

test('date in text: DDth mmmmm, YYYY', () => {
    const block = ['28th June, 2024', '1-1-24']
    expect(detectDate(block)[0]).toBe('6-28')
    expect(detectDate(block)[1]).toBe('2024')
})

test('date in text: mmmmm DD, YYYY', () => {
    const block = [undefined, 'Friend #018 April 30, 2024 Bruno']
    expect(detectDate(block)[0]).toBe('4-30')
    expect(detectDate(block)[1]).toBe('2024')
})

test('date in text: mmmmm, DD YYYY', () => {
    const block = [undefined, 'February, 12 2024']
    expect(detectDate(block)[0]).toBe('2-12')
    expect(detectDate(block)[1]).toBe('2024')
})

test('date in text: mmmmm DDth, YYYY', () => {
    const block = [undefined, 'Friend #018 April 30th, 2024 Bruno']
    expect(detectDate(block)[0]).toBe('4-30')
    expect(detectDate(block)[1]).toBe('2024')
})

test('dates not to recognize', () => {
    const block = ['David Wojnarowicz - Cross Country 1: February-March 1989 (Part 1)', '2021-08-31T08:56:59.785Z']
    expect(detectDate(block)[0]).toBe('8-31')
    expect(detectDate(block)[1]).toBe('2021')
})

test('numbers not to recognize', () => {
    const block = ['1 to 40 side by side', '2020-06-29T16:31:38.846Z']
    expect(detectDate(block)[0]).toBe('6-29')
    expect(detectDate(block)[1]).toBe('2020')
})

test('filenames not to recognize', () => {
    const block = ['74c68bfb-970a-4e88-a447-691934a42c42.jpg', '2024-07-21T18:37:59.078Z']
    expect(detectDate(block)[0]).toBe('7-21')
    expect(detectDate(block)[1]).toBe('2024')
})

test('filenames not to recognize', () => {
    const block = ['5330824d-5e59-4c55-8150-b67dbf44da7d.jpg', '2024-07-21T18:37:59.078Z']
    expect(detectDate(block)[0]).toBe('7-21')
    expect(detectDate(block)[1]).toBe('2024')
})

test('filenames not to recognize', () => {
    const block = ['47020122222_e2f42222aa_o.jpg?w=600-h=1200', '2023-10-20T23:32:39.272Z']
    expect(detectDate(block)[0]).toBe('10-20')
    expect(detectDate(block)[1]).toBe('2023')
})


test('what about ranges?', () => {
    const block = ['4/6/23–4/8/23']
    expect(detectDate(block)[0]).toBe('4-6')
    expect(detectDate(block)[1]).toBe('2023')
})

test('abbreviated month', () => {
    const block = ['31Jan2024']
    expect(detectDate(block)[0]).toBe('1-31')
    expect(detectDate(block)[1]).toBe('2024')
})