class Picture < ApplicationRecord
  has_one :medium, as: :mediable
end
