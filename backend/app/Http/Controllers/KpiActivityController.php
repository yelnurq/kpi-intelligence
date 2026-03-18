<?php

namespace App\Http\Controllers;

use App\Models\KpiActivity;
use App\Models\User;
use App\Models\Token;
use Illuminate\Http\Request;

class KpiActivityController extends Controller
{
private function getAuthenticatedUser(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if (!$bearerToken) return null;

        $tokenRecord = Token::where("token", $bearerToken)->first();
        if (!$tokenRecord) return null;

        return User::find($tokenRecord->user_id);
    }

public function store(Request $request)
{
    $user = $this->getAuthenticatedUser($request);

    $request->validate([
        'indicator_id' => 'required|exists:kpi_indicators,id',
        'quantity' => 'required|integer|min:1',
        'files.*' => 'required|file|max:10240', // 10MB на файл
    ]);

    $activity = KpiActivity::create([
        'user_id' => $user->id,
        'indicator_id' => $request->indicator_id,
        'quantity' => $request->quantity,
        'status' => 'pending'
    ]);

    // 2. Сохраняем файлы в таблицу KpiEvidence
    if ($request->hasFile('files')) {
        foreach ($request->file('files') as $file) {
            $path = $file->store('kpi_evidence', 'public');
            
            $activity->evidence()->create([
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientMimeType()
            ]);
        }
    }

    return response()->json([
        'status' => 'success',
        'message' => 'Заявка отправлена',
        'activity_id' => $activity->id
    ]);
}
}
