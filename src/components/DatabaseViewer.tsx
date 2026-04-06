import { useMemo, useState } from 'react';
import { Database, Download, Eye, Lock, RefreshCw, Search } from 'lucide-react';
import { apiFetch } from '../api';

type TableInfo = { name: string; rowsCount: number | null };

export const DatabaseViewer = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [database, setDatabase] = useState('');
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(term))
    );
  }, [rows, search]);

  const connect = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(
        `/api/db-viewer/summary?admin_user=${encodeURIComponent(username)}&admin_pass=${encodeURIComponent(password)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Database connection failed');
      setDatabase(data.database || '');
      setTables(data.tables || []);
      setSelectedTable('');
      setRows([]);
      setColumns([]);
    } catch (err: any) {
      setError(err.message || 'Failed to connect database viewer.');
    } finally {
      setLoading(false);
    }
  };

  const openTable = async (tableName: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(
        `/api/db-viewer/table/${encodeURIComponent(tableName)}?admin_user=${encodeURIComponent(username)}&admin_pass=${encodeURIComponent(password)}&limit=100`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load table');
      setSelectedTable(tableName);
      setRows(data.rows || []);
      setColumns(data.columns || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load table rows.');
    } finally {
      setLoading(false);
    }
  };

  const exportRows = () => {
    if (!selectedTable || !columns.length || !filteredRows.length) return;

    const escapeCell = (value: unknown) => {
      const text = String(value ?? '');
      if (/[",\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    const csv = [
      columns.join(','),
      ...filteredRows.map((row) => columns.map((column) => escapeCell(row[column])).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTable}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[680px] bg-[#0a0505] rounded-[28px] border border-rose-500/20 p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center">
          <Database className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">DB Viewer</h2>
          <p className="text-sm text-rose-200/60">Read-only MySQL table viewer for quick checking, records, and schema browsing.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#151010] p-6 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-rose-300/60">Username</label>
            <div className="mt-2 relative">
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 text-white outline-none focus:border-rose-500/40" />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.25em] text-rose-300/60">Password</label>
            <div className="mt-2 relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0f0a0a] p-4 pr-10 text-white outline-none focus:border-rose-500/40" />
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={connect} className="cursor-pointer w-full px-4 py-4 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <Eye size={16} />}
              {loading ? 'Connecting...' : 'Open Database'}
            </button>
          </div>
        </div>
        {database && (
          <div className="text-sm text-slate-300">
            Connected database: <span className="text-white font-bold">{database}</span>
          </div>
        )}
        {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
      </div>

      <div className="grid lg:grid-cols-[320px,1fr] gap-6">
        <div className="rounded-3xl border border-white/10 bg-[#151010] p-4 space-y-3">
          <h3 className="text-white font-black px-2">Tables</h3>
          <div className="max-h-[540px] overflow-auto space-y-2 pr-1">
            {tables.map((table) => (
              <button
                key={table.name}
                onClick={() => openTable(table.name)}
                className={`cursor-pointer w-full rounded-2xl border p-4 text-left transition-colors ${
                  selectedTable === table.name
                    ? 'border-rose-500/40 bg-rose-500/10 text-white'
                    : 'border-white/10 bg-[#0f0a0a] text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold break-all">{table.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    {table.rowsCount ?? 0}
                  </span>
                </div>
              </button>
            ))}
            {!tables.length && <p className="text-sm text-slate-500 px-2">Connect first to load tables.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#151010] p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-white font-black">{selectedTable || 'Table Preview'}</h3>
              <p className="text-sm text-slate-400">Showing up to 100 rows for quick review.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rows..." className="w-full rounded-2xl border border-white/10 bg-[#0f0a0a] pl-11 pr-4 py-3 text-white outline-none focus:border-rose-500/40" />
              </div>
              <button
                onClick={exportRows}
                disabled={!selectedTable || !columns.length || !filteredRows.length}
                className="cursor-pointer rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="inline-flex items-center gap-2">
                  <Download size={16} />
                  Export CSV
                </span>
              </button>
            </div>
          </div>

          {!!selectedTable && !!columns.length && (
            <div className="rounded-2xl border border-white/10 bg-[#0f0a0a] px-4 py-3 text-sm text-slate-300">
              Showing <span className="font-bold text-white">{filteredRows.length}</span> row(s)
              {search ? ' after search filtering' : ''}. Export downloads exactly what you are seeing here.
            </div>
          )}

          <div className="overflow-auto rounded-2xl border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-black/30">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-4 py-3 text-left text-rose-200 font-bold whitespace-nowrap">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-white/5">
                    {columns.map((column) => (
                      <td key={column} className="px-4 py-3 text-slate-300 max-w-[280px] whitespace-pre-wrap break-words align-top">
                        {String(row[column] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {!columns.length && (
              <div className="p-10 text-center text-slate-500">Pick a table to preview its rows here.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
