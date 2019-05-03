<template>
  <div class='language-js extra-class'>
    <pre class='language-js'><code v-html='code'></code></pre>
  </div>
</template>

<script>
  const syntax = [
    { match: /(\s|^|\()(#.*)/g, name: "comment" },
    { match: /(\s|^|\(|\[)('[^']*')/g, name: "string" },
    { match: /(\s|^|\()(fun|return|if)/g, name: "keyword" },
    { match: /(\s|^|\()(\>|\=|\-\>|\.|\$)/g, name: "operator" },
    { match: /(\s|^|\(|\[)(\d+)/g, name: "number" },
    { match: /(\s|^|\()(true|false)/g, name: "boolean" },
    { match: /(\s|^|\()(@[^\s\-\(\)\,\.\[\]\>\$]+)/g, name: "variable" }
  ];

  export default {
    data() {
      return {
        code: ""
      };
    },
    created() {
      let code = this.$slots.default[0].children[0].children[0].children[0].text;

      code.replace(/ /, "&nbsp;");

      syntax.forEach(
        rule =>
          (code = code.replace(
            rule.match,
            `$1<span class="token ${rule.name}">$2</span>`
          ))
      );

      this.code = code;
    }
  };
</script>
