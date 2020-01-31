class ProgramSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :created_at, :updated_at
  attributes :message

  def message
    "success"
  end

end
