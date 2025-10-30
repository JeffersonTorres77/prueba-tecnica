<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['project','assignee']);

        // Filters
        if ($status = $request->query('status')) {
            // only allow expected statuses
            if (in_array($status, ['todo','in_progress','done'])) {
                $query->where('status', $status);
            }
        }

        if ($projectId = $request->query('project_id')) {
            $query->where('project_id', $projectId);
        }

        if ($assigned = $request->query('assigned_user_id')) {
            $query->where('assigned_user_id', $assigned);
        }

        // Optional pagination: pass ?page=2 or ?per_page=20
        if ($request->query('per_page')) {
            $perPage = (int) $request->query('per_page', 15);
            $tasks = $query->paginate($perPage);
        } elseif ($request->query('page')) {
            // default pagination size
            $tasks = $query->paginate(15);
        } else {
            $tasks = $query->get();
        }

        return response()->json($tasks);
    }

    public function show($id)
    {
        $task = Task::with(['project','assignee'])->findOrFail($id);
        return response()->json($task);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'assigned_user_id' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:todo,in_progress,done',
        ]);

        $task = Task::create($data);

        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $data = $request->validate([
            'project_id' => 'sometimes|required|exists:projects,id',
            'assigned_user_id' => 'nullable|exists:users,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:todo,in_progress,done',
        ]);

        $task->update($data);

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json(null, 204);
    }
}
