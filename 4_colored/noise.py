import noise
import random

class NoiseGenerator:
    seed = None
    scale = 30
    passes = 4
 
    @classmethod
    def data_at(cls, pos):
        if not cls.seed:
            cls.seed = int(random.random() * 100000)
        val = 0
        for i in range(cls.passes):
            p = cls.passes - i
            val += noise.snoise2(pos.x / (cls.scale * p), pos.y / (cls.scale * p), base=cls.seed)
        return val / cls.passes

