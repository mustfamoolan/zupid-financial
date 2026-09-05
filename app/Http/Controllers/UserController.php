<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => ['required', Rule::in(['admin', 'employee'])],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $createdUser = User::create($validated);

        \App\Models\ActivityLog::log('إضافة مستخدم', "تم إنشاء حساب مستخدم جديد باسم ({$createdUser->name}) وتصنيف ({$createdUser->role})");

        return redirect()->back()->with('success', 'تم إضافة المستخدم بنجاح');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'employee'])],
            'password' => 'nullable|string|min:6',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        \App\Models\ActivityLog::log('تحديث مستخدم', "تم تحديث بيانات حساب المستخدم ({$user->name})");

        return redirect()->back()->with('success', 'تم تحديث بيانات المستخدم بنجاح');
    }

    public function destroy(User $user): RedirectResponse
    {
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'لا يمكنك حذف حسابك الحالي');
        }

        $name = $user->name;
        $user->delete();

        \App\Models\ActivityLog::log('حذف مستخدم', "تم حذف حساب المستخدم ({$name}) من النظام");

        return redirect()->back()->with('success', 'تم حذف المستخدم بنجاح');
    }
}
