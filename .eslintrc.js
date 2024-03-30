module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-var': 2, // var 금지
    eqeqeq: 2, // 일치 연산자 사용 필수
    'no-extra-semi': 'error', // 불필요한 세미콜론 사용 시 에러 표시
    'arrow-parens': [1, 'as-needed'], // 화살표 함수의 파라미터가 하나일때 괄호 생략
    'no-unused-vars': 1, // 사용하지 않는 변수가 있을 때 발생하는 경고
    'no-console': 0, // 콘솔 사용 시 발생하는 경고 비활성화
    'import/prefer-default-export': 0, // export문이 하나일 때 default export 사용 권장 경고 비활성화
    'no-debugger': 0, // 디버그 허용
    'prettier/prettier': [2, { endOfLine: 'auto' }], // [error] Delete prettier/prettier
    'no-nested-ternary': 0,
    'import/no-unresolved': [0, { caseSensitive: false }], // 파일의 경로가 틀렸는지 확인하는 옵션 false
    'linebreak-style': 0,
    'import/extensions': 0,
    'no-use-before-define': 0,
    'import/no-extraneous-dependencies': 0, // 테스트 또는 개발환경을 구성 파일에서는 devDependency 사용 허용
    'comma-dangle': 1, // 마지막에 콤마 있을 때 오류 안내게
    'comma-spacing': [1, { after: true }], // 콤마 뒤에 spacing
    'eol-last': 1, // 파일 끝에 무조건 개행 있어야함
    camelcase: 1, // 카멜케이스
    '@typescript-eslint/array-type': [1, { default: 'generic' }], // Array<T> 형식으로 쓰기
    '@typescript-eslint/type-annotation-spacing': 1, // : void 처럼 타입 기입 전에 whitespace
    'implicit-arrow-linebreak': 0,
    'no-shadow': 0, // outer 스코프 변수 사용
    'operator-linebreak': 0, // 연산자가 있을 때 줄바꿈 제한
    quotes: [1, 'single'], // single-quote 사용
    'import/no-absolute-path': 0, // 절대경로 사용 허용
  },
};
