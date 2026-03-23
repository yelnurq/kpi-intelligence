<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KpiEvidence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KpiEvidenceController extends Controller
{
    // Получить все файлы (Asset Management)
    public function index()
    {
        return KpiEvidence::with('activity.user') // Подгружаем владельца через активность
            ->latest()
            ->get();
    }

    // Загрузка нового файла
    public function store(Request $request)
    {
        $request->validate([
            'kpi_activity_id' => 'required|exists:kpi_activities,id',
            'file' => 'required|file|max:10240', // макс 10MB
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('evidence', 'public');

            $evidence = KpiEvidence::create([
                'kpi_activity_id' => $request->kpi_activity_id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getClientOriginalExtension(),
            ]);

            return response()->json($evidence, 201);
        }
    }

    // Удаление (одиночное или массовое)
    public function destroy(Request $request, $id)
    {
        // Если ID — это список через запятую (для массового удаления)
        $ids = explode(',', $id);
        $files = KpiEvidence::whereIn('id', $ids)->get();

        foreach ($files as $file) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        }

        return response()->json(['message' => 'Успешно удалено']);
    }
}