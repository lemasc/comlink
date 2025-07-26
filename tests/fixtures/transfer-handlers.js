(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === "object") {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.registerMockTransferHandlers = factory().registerMockTransferHandlers;
    root.unregisterMockTransferHandlers =
      factory().unregisterMockTransferHandlers;
  }
})(typeof self !== "undefined" ? self : this, function () {
  function registerMockTransferHandlers(Comlink) {
    Comlink.transferHandlers.set("sync-arraybuffer", {
      canHandle: (data) => data instanceof ArrayBuffer,
      serialize: (data) => [data, []],
      deserialize: (data) => data,
    });
    Comlink.transferHandlers.set("async-file", {
      canHandle: (data) => data instanceof File,
      serialize: async (data) => [
        {
          data: await data.arrayBuffer(),
          type: data.type,
        },
        [],
      ],
      deserialize: async (data) => {
        const blob = new Blob([data.data], { type: data.type });
        return new File([blob], "file", { type: blob.type });
      },
    });
  }

  function unregisterMockTransferHandlers(Comlink) {
    Comlink.transferHandlers.delete("sync-arraybuffer");
    Comlink.transferHandlers.delete("async-file");
  }

  return {
    registerMockTransferHandlers,
    unregisterMockTransferHandlers,
  };
});
