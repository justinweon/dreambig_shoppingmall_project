// 돌아갈 주소가 안전한 우리 사이트 안쪽 주소인지 확인
export function getSafeRedirect(path: string): string {
    if (
        !path.startsWith('/') ||
        path.startsWith('//') ||
        path.startsWith('/login') ||
        path.startsWith('/signup')
    ) {
        return '/';
    }
    return path;
}