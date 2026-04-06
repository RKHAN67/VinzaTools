import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Search, Upload } from 'lucide-react';

export const CsvViewer = () => {
  const [rows, setRows] = useState<string[][]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [sheetMap, setSheetMap] = useState<Record<string, string[][]>>({});
  const [search, setSearch] = useState('');

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => row.some((cell) => String(cell ?? '').toLowerCase().includes(term)));
  }, [rows, search]);

  const loadFile = async (file: File) => {
    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: 'array' });
    const nextSheet = workbook.SheetNames[0] || '';
    const nextMap = workbook.SheetNames.reduce<Record<string, string[][]>>((acc, sheetName) => {
      acc[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }) as string[][];
      return acc;
    }, {});
    setSheetNames(workbook.SheetNames);
    setSheetMap(nextMap);
    setActiveSheet(nextSheet);
    setRows(nextMap[nextSheet] || []);
  };

  return (
    <div className="min-h-[620px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center">
          <FileSpreadsheet className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">CSV / XLSX Viewer</h2>
          <p className="text-sm text-rose-200/60">Open spreadsheets quickly and review rows directly inside VinzaTools.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
        <label className="cursor-pointer rounded-3xl border border-dashed border-rose-500/30 bg-[#0f0a0a] p-10 flex flex-col items-center justify-center gap-3 text-center">
          <Upload className="text-rose-400" size={36} />
          <div>
            <p className="text-white font-black text-xl">Upload CSV or Excel file</p>
            <p className="text-sm text-slate-400">Supports `.csv`, `.xlsx`, `.xls`</p>
          </div>
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </label>

        {!!sheetNames.length && (
          <div className="flex flex-wrap gap-2">
            {sheetNames.map((sheet) => (
              <button key={sheet} onClick={() => { setActiveSheet(sheet); setRows(sheetMap[sheet] || []); }} className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-bold ${activeSheet === sheet ? 'bg-rose-500 text-white' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                {sheet}
              </button>
            ))}
          </div>
        )}

        {!!rows.length && (
          <>
            <div className="relative max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sheet..." className="w-full rounded-2xl border border-white/10 bg-[#0f0a0a] pl-11 pr-4 py-3 text-white outline-none focus:border-rose-500/40" />
            </div>
            <div className="overflow-auto rounded-2xl border border-white/10">
              <table className="min-w-full text-sm">
                <tbody>
                  {filteredRows.slice(0, 200).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-white/5">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 text-slate-300 whitespace-pre-wrap break-words max-w-[280px]">
                          {String(cell ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

