# Originally coppied from:
# https://raw.githubusercontent.com/tj/commander.js/c6c84726050b19c0373de27cd359f3baddff579f/Makefile
# See license at https://github.com/tj/commander.js/blob/c6c84726050b19c0373de27cd359f3baddff579f/LICENSE

TESTS = $(shell find test/test.*.js)

test:
	@./test/run $(TESTS)

.PHONY: test
