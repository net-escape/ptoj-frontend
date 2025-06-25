import type { Cell } from 'exceljs'
import type { ContestDetail, Ranklist, RawRanklist } from '@/types'

const PENALTY = 20 * 60 * 1000 // 失败提交罚时 20 分钟

export function normalize (ranklist: RawRanklist, contest: ContestDetail): Ranklist {
  const list: Ranklist = [] // 结果

  Object.keys(ranklist).forEach((uid) => {
    const row = ranklist[uid]
    let solved = 0 // 记录 ac 几道题
    let penalty = 0 // 罚时，尽在 ac 时计算
    for (const pid of contest.list) {
      if (row[pid] == null) continue // 这道题没有交过
      const submission = row[pid]
      if (submission.accepted > -1) { // ac 了
        solved++
        penalty += submission.accepted - contest.start + submission.failed * PENALTY
      }
    }
    list.push({
      uid,
      solved,
      penalty,
      ...row,
    })
  })

  // 排序, 先按照 solved, 在按照 penalty
  list.sort((x, y) => {
    if (x.solved !== y.solved)
      return -(x.solved - y.solved)
    return x.penalty - y.penalty
  })

  // 接下来计算 primes
  const quickest: Record<number, number> = {} // 每到题最早提交的 ac 时间
  for (const pid of contest.list)
    quickest[pid] = Number.POSITIVE_INFINITY // init

  list.forEach((row) => {
    for (const pid of contest.list) {
      if (row[pid] != null && row[pid].accepted > -1)
        quickest[pid] = Math.min(quickest[pid], row[pid].accepted)
    }
  })

  list.forEach((row) => {
    for (const pid of contest.list) {
      if (row[pid] == null || row[pid].accepted === -1) continue
      if (quickest[pid] === row[pid].accepted) { // 这就是最早提交的那个
        row[pid].isPrime = true // 打上标记
      }
    }
  })
  return list
}

export async function exportSheet (
  contest: ContestDetail,
  ranklist: Ranklist,
): Promise<void> {
  const ExcelJS = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Ranklist')

  worksheet.columns = [
    { header: 'Rank', width: 6 },
    { header: 'Username', width: 16 },
    { header: 'Nickname', width: 16 },
    { header: 'Solved', width: 8 },
    { header: 'Penalty', width: 8 },
    ...contest.list.map((_, i) => ({
      header: `${i + 1}`,
      width: 10,
    })),
  ]

  const applyStyle = (
    cell: Cell,
    options: {
      bold?: boolean
      color?: string
      border?: boolean
      fill?: string
    },
  ) => {
    const { bold, color, border, fill } = options

    if (bold || color) {
      cell.font = {
        bold: bold || false,
        color: color ? { argb: color } : undefined,
      }
    }

    if (border) {
      cell.border = Object.fromEntries(
        [ 'top', 'left', 'bottom', 'right' ]
          .map(side => [ side, { style: 'thin' } ]),
      )
    }

    if (fill) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fill },
      }
    }
  }

  const headerRow = worksheet.getRow(1)
  headerRow.eachCell((cell) => {
    applyStyle(cell, {
      bold: true,
      border: true,
      fill: 'D9D9D9',
    })
  })

  ranklist.forEach((row, rank) => {
    const excelRow = worksheet.addRow([
      rank + 1,
      row.uid,
      row.nick || '',
      row.solved,
      Math.floor(row.penalty / 60 / 1000),
      ...contest.list.map((pid) => {
        const status = row[pid]
        if (!status) return '-'
        if (status.accepted === -1) return `-${status.failed}`
        const time = Math.floor((status.accepted - contest.start) / 60 / 1000)
        return `+${status.failed > 0 ? status.failed : ''} (${time})`
      }),
    ])

    contest.list.forEach((pid, index) => {
      const cell = excelRow.getCell(index + 6)
      const status = row[pid]

      if (!status) return
      if (status.accepted !== -1) {
        applyStyle(cell, {
          bold: true,
          color: status.isPrime ? '0000FF' : '008000',
          border: true,
        })
      } else if (status.failed > 0) {
        applyStyle(cell, { color: 'FF0000', border: true })
      }
    })

    excelRow.eachCell((cell) => {
      if (!cell.border) {
        applyStyle(cell, { border: true })
      }
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([ buffer ], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${contest.title} - Ranklist.xlsx`
  link.click()
}
