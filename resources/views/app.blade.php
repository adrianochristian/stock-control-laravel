<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
  @inertiaHead
</head>
<body>
  @inertia
</body>
</html>