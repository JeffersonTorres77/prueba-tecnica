<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['owner','tasks'])->get();
        return response()->json($projects);
    }

    public function show($id)
    {
        $project = Project::with(['owner','tasks'])->findOrFail($id);
        return response()->json($project);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'sometimes|exists:users,id',
        ]);

        if (empty($data['user_id'])) {
            $data['user_id'] = $request->user()->id;
        }

        $project = Project::create($data);

        return response()->json($project, 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'sometimes|exists:users,id',
        ]);

        $project->update($data);

        return response()->json($project);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(null, 204);
    }
}
