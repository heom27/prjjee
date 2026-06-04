'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    id: '', text: { tr: '' }, active: true, order: 1,
    options: [
      { key: 'A', text: { tr: '' }, scores: {} },
      { key: 'B', text: { tr: '' }, scores: {} },
      { key: 'C', text: { tr: '' }, scores: {} },
      { key: 'D', text: { tr: '' }, scores: {} },
    ],
  });
  const [bulkText, setBulkText] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('questions');

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) {
      router.push('/admin');
      return;
    }
    setToken(t);
  }, [router]);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token]);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, questionsRes] = await Promise.all([
        fetch('/api/v1/stats'),
        fetch('/api/v1/admin/questions', { headers: authHeaders() }),
      ]);

      if (questionsRes.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin');
        return;
      }

      const statsData = await statsRes.json();
      const questionsData = await questionsRes.json();

      setStats(statsData);
      setQuestions(questionsData.questions || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [authHeaders, router]);

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token, fetchData]);

  const handlePublish = async () => {
    try {
      const res = await fetch('/api/v1/admin/publish', {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      setMessage(`✅ Yayınlandı! Sürüm: ${data.version}, ${data.count} soru yayında.`);
      fetchData();
    } catch (err) {
      setMessage('❌ Yayınlama hatası: ' + err.message);
    }
  };

  const handleSaveQuestion = async (question) => {
    try {
      const res = await fetch('/api/v1/admin/questions', {
        method: editingId ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(question),
      });
      if (res.ok) {
        setMessage(editingId ? '✅ Soru güncellendi' : '✅ Soru eklendi');
        setEditingId(null);
        setShowAddForm(false);
        setNewQuestion({
          id: '', text: { tr: '' }, active: true, order: questions.length + 2,
          options: [
            { key: 'A', text: { tr: '' }, scores: {} },
            { key: 'B', text: { tr: '' }, scores: {} },
            { key: 'C', text: { tr: '' }, scores: {} },
            { key: 'D', text: { tr: '' }, scores: {} },
          ],
        });
        fetchData();
      }
    } catch (err) {
      setMessage('❌ Kaydetme hatası: ' + err.message);
    }
  };

  const handleEditClick = (q) => {
    setEditingId(q.id);
    setNewQuestion(q);
    setShowAddForm(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;
    try {
      await fetch(`/api/v1/admin/questions?id=${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      setMessage('✅ Soru silindi');
      fetchData();
    } catch (err) {
      setMessage('❌ Silme hatası');
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkText);
      if (!Array.isArray(parsed)) {
        throw new Error('İçerik bir JSON dizisi ([...]) olmalıdır.');
      }

      for (const q of parsed) {
        if (!q.id || !q.text || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Soru ID'si eksik veya seçenek yapısı hatalı: ${JSON.stringify(q)}`);
        }
      }

      for (const q of parsed) {
        await fetch('/api/v1/admin/questions', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            ...q,
            active: q.active !== undefined ? q.active : true,
            version: q.version || 1,
            order: q.order || 1,
          }),
        });
      }

      setMessage(`✅ Toplam ${parsed.length} soru başarıyla içeri aktarıldı!`);
      setBulkText('');
      setActiveTab('questions');
      fetchData();
    } catch (err) {
      setMessage('❌ Hata: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const insertTemplate = () => {
    const template = [
      {
        id: "q16",
        order: 16,
        text: { tr: "Yeni örnek soru metni?" },
        options: [
          { key: "A", text: { tr: "Seçenek A" }, scores: { y1: 2, y3: 1 } },
          { key: "B", text: { tr: "Seçenek B" }, scores: { y2: 3 } },
          { key: "C", text: { tr: "Seçenek C" }, scores: { y4: 2 } },
          { key: "D", text: { tr: "Seçenek D" }, scores: { y5: 2 } }
        ]
      }
    ];
    setBulkText(JSON.stringify(template, null, 2));
  };

  if (!token) return null;

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Paneli</h1>
            <p className="text-white/40 text-sm mt-1">Soru yönetimi ve istatistikler</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/')} className="btn-secondary text-sm py-2 px-4">
              🏠 Siteye Git
            </button>
            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 py-2 px-4">
              Çıkış
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="glass-card p-3 mb-6 text-center text-sm">
            {message}
            <button onClick={() => setMessage('')} className="ml-3 text-white/40 hover:text-white/60">✕</button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-brand-400">{stats.totalSubmissions}</div>
              <div className="text-sm text-white/50 mt-1">Toplam Test</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-brand-400">{questions.filter(q => q.active).length}</div>
              <div className="text-sm text-white/50 mt-1">Aktif Soru</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-lg font-bold text-brand-400">
                {stats.topAuthors?.[0]?.name || '—'}
              </div>
              <div className="text-sm text-white/50 mt-1">En Çok Çıkan Yazar</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['questions', 'bulk_import', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/5 text-white/50 hover:text-white/80'
              }`}
            >
              {tab === 'questions' ? '📝 Sorular' : tab === 'bulk_import' ? '📥 Toplu Test Ekle' : '📊 İstatistikler'}
            </button>
          ))}
        </div>

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <div className="flex gap-3 mb-4">
              <button 
                onClick={() => {
                  setEditingId(null);
                  setNewQuestion({
                    id: `q${String(questions.length + 1).padStart(2, '0')}`, 
                    text: { tr: '' }, 
                    active: true, 
                    order: questions.length + 1,
                    options: [
                      { key: 'A', text: { tr: '' }, scores: {} },
                      { key: 'B', text: { tr: '' }, scores: {} },
                      { key: 'C', text: { tr: '' }, scores: {} },
                      { key: 'D', text: { tr: '' }, scores: {} },
                    ],
                  });
                  setShowAddForm(!showAddForm);
                }} 
                className="btn-primary text-sm py-2 px-4"
              >
                {showAddForm && !editingId ? '✖ Kapat' : '➕ Tek Soru Ekle'}
              </button>
              <button onClick={handlePublish} className="btn-secondary text-sm py-2 px-4">
                🚀 Değişiklikleri Yayınla (Publish)
              </button>
            </div>

            {/* Add / Edit Question Form */}
            {showAddForm && (
              <div className="glass-card p-6 mb-4 border-brand-500/40 border">
                <h3 className="text-lg font-semibold mb-4 text-brand-300">
                  {editingId ? `Soruyu Düzenle (${editingId})` : 'Yeni Soru Ekle'}
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      placeholder="Soru ID (q16, q17...)"
                      value={newQuestion.id}
                      disabled={!!editingId}
                      onChange={e => setNewQuestion(prev => ({ ...prev, id: e.target.value }))}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm disabled:opacity-50"
                    />
                    <input
                      placeholder="Sıra Numarası (Order)"
                      type="number"
                      value={newQuestion.order}
                      onChange={e => setNewQuestion(prev => ({ ...prev, order: parseInt(e.target.value, 10) || 1 }))}
                      className="w-32 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <input
                    placeholder="Soru metni (Türkçe)"
                    value={newQuestion.text.tr}
                    onChange={e => setNewQuestion(prev => ({ ...prev, text: { tr: e.target.value } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  {newQuestion.options.map((opt, i) => (
                    <div key={opt.key} className="flex gap-2 items-center">
                      <span className="text-white/40 font-bold w-6 text-center">{opt.key}</span>
                      <input
                        placeholder={`Seçenek ${opt.key} metni`}
                        value={opt.text.tr}
                        onChange={e => {
                          const opts = [...newQuestion.options];
                          opts[i] = { ...opts[i], text: { tr: e.target.value } };
                          setNewQuestion(prev => ({ ...prev, options: opts }));
                        }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                      />
                      <input
                        placeholder='Puanlar (Örn: {"y1":2})'
                        value={JSON.stringify(opt.scores || {})}
                        onChange={e => {
                          try {
                            const scores = JSON.parse(e.target.value);
                            const opts = [...newQuestion.options];
                            opts[i] = { ...opts[i], scores };
                            setNewQuestion(prev => ({ ...prev, options: opts }));
                          } catch {}
                        }}
                        className="w-48 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                      />
                    </div>
                  ))}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleSaveQuestion(newQuestion)}
                      className="btn-primary text-sm py-2 px-6"
                    >
                      {editingId ? 'Güncelle' : 'Kaydet'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId(null);
                      }}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            {questions
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(q => (
                <div key={q.id} className={`glass-card p-4 transition-all hover:bg-white/10 ${!q.active ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                          {q.id}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${q.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {q.active ? 'Aktif' : 'Pasif'}
                        </span>
                        <span className="text-xs text-white/30">Sıra: {q.order} • v{q.version || 1}</span>
                      </div>
                      <p className="text-white/80 text-sm font-semibold">{q.text?.tr}</p>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options?.map(opt => (
                          <div key={opt.key} className="text-xs text-white/50 bg-white/5 px-2 py-1.5 rounded flex justify-between">
                            <span><strong>{opt.key}:</strong> {opt.text?.tr}</span>
                            <span className="text-brand-300 font-mono">{JSON.stringify(opt.scores)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => handleEditClick(q)}
                        className="text-xs bg-brand-600/30 hover:bg-brand-600 text-brand-300 hover:text-white px-2.5 py-1.5 rounded transition-all"
                      >
                        Düzenle 📝
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-xs bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white px-2.5 py-1.5 rounded transition-all"
                      >
                        Sil 🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Bulk Import Tab */}
        {activeTab === 'bulk_import' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-2 text-brand-300">Toplu Test / Soru İçe Aktar</h3>
            <p className="text-white/50 text-sm mb-4">
              Aşağıdaki kutuya JSON formatındaki sorularınızı yapıştırarak tek seferde kaydedebilirsiniz.
            </p>
            <div className="flex gap-3 mb-4">
              <button onClick={insertTemplate} className="btn-secondary text-xs py-1.5 px-3">
                📋 Örnek Şablon Ekle
              </button>
            </div>
            <textarea
              rows={15}
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              placeholder='[
  {
    "id": "q16",
    "order": 16,
    "text": { "tr": "Örnek soru?" },
    "options": [
      { "key": "A", "text": { "tr": "A seçeneği" }, "scores": { "y1": 2 } },
      ...
    ]
  }
]'
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all mb-4"
            />
            <button onClick={handleBulkImport} className="btn-primary">
              💾 Çözümle ve Kaydet
            </button>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Yazar Dağılımı</h3>
            <div className="space-y-3">
              {stats.topAuthors?.map((author) => (
                <div key={author.id} className="flex items-center gap-3">
                  <span className="text-sm text-white/60 w-32">{author.name}</span>
                  <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
                      style={{
                        width: `${stats.totalSubmissions > 0 ? (author.count / stats.totalSubmissions) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-white/40 w-12 text-right">{author.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
