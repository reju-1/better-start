import os
import sys

from app.worker import worker


if __name__ == "__main__":
    try:
        worker()
    except KeyboardInterrupt:
        print("Interrupted")
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
